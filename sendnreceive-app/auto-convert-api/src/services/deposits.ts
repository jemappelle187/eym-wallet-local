import { randomUUID } from 'crypto';
import { 
  FiatDeposit, 
  FxTrade, 
  MintJob, 
  Stablecoin, 
  FiatCurrency,
  DepositWebhookPayload,
  ConversionResponse 
} from '../types';
import { circle } from './circle';
import { fxPartner } from './fx';
import { creditUser } from './ledger';
import { once, generateIdempotencyKey, generateDepositId } from '../utils/idempotency';

// In-memory stores (replace with database in production)
const deposits = new Map<string, FiatDeposit>();
const mints = new Map<string, MintJob>();
const fxTrades = new Map<string, FxTrade>();

export const store = { deposits, mints, fxTrades };

/**
 * Handle deposit webhook from payment providers
 * @param payload - Deposit webhook payload
 * @returns Processed deposit
 */
export async function handleDepositWebhook(payload: DepositWebhookPayload): Promise<FiatDeposit> {
  console.log(`📥 Processing deposit webhook:`, payload);
  
  // Generate deposit ID if not provided
  const depositId = generateDepositId(payload.id);
  
  // Create deposit record
  const dep: FiatDeposit = {
    id: depositId,
    userId: payload.userId,
    currency: payload.currency,
    amount: Number(payload.amount),
    status: 'pending',
    paymentMethod: payload.paymentMethod,
    paymentReference: payload.paymentReference,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  deposits.set(dep.id, dep);
  console.log(`✅ Deposit created: ${dep.id}`);

  // Auto-convert immediately
  try {
    await convertDeposit(dep.id);
    console.log(`✅ Auto-conversion completed for deposit: ${dep.id}`);
  } catch (error: any) {
    console.error(`❌ Auto-conversion failed for deposit ${dep.id}:`, error.message);
    dep.status = 'failed';
    dep.updatedAt = new Date().toISOString();
  }

  return deposits.get(dep.id)!;
}

/**
 * Convert deposit to stablecoin
 * @param depositId - The deposit ID to convert
 * @returns Conversion result
 */
export async function convertDeposit(depositId: string): Promise<ConversionResponse> {
  console.log(`🔄 Starting conversion for deposit: ${depositId}`);
  
  const dep = deposits.get(depositId);
  if (!dep) {
    throw new Error('Deposit not found');
  }

  // Ensure idempotency
  const idempotencyKey = `convert:${depositId}`;
  if (!once(idempotencyKey)) {
    console.log(`🔄 Conversion already in progress for deposit: ${depositId}`);
    const existingMint = mints.get(depositId);
    return {
      success: true,
      deposit: dep,
      mint: existingMint,
      fxTrade: getFxByDeposit(depositId)
    };
  }

  try {
    // Update deposit status to processing
    dep.status = 'processing';
    dep.updatedAt = new Date().toISOString();

    let stablecoin: Stablecoin;
    let amountToMint = dep.amount;
    let fxTrade: FxTrade | undefined;

    // Determine conversion path based on currency
    if (dep.currency === 'USD') {
      // USD -> USDC (1:1)
      stablecoin = 'USDC';
      console.log(`💱 Direct USD to USDC conversion: ${dep.amount} USD`);
      
    } else if (dep.currency === 'EUR') {
      // EUR -> EURC (1:1)
      stablecoin = 'EURC';
      console.log(`💱 Direct EUR to EURC conversion: ${dep.amount} EUR`);
      
    } else if (['GHS', 'AED', 'NGN'].includes(dep.currency)) {
      // Local currencies -> USD -> USDC
      console.log(`💱 Converting ${dep.currency} to USD first...`);
      
      const fx = await fxPartner.convertCurrency(dep.currency as FiatCurrency, 'USD', dep.amount);
      
      // Create FX trade record
      fxTrade = {
        id: randomUUID(),
        depositId: dep.id,
        fromCurrency: dep.currency as FiatCurrency,
        toCurrency: 'USD',
        rate: fx.rate,
        spreadBps: fx.spreadBps,
        amountReceived: fx.amountReceived,
        partnerRef: fx.partnerRef,
        status: 'complete',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      fxTrades.set(fxTrade.id, fxTrade);
      console.log(`✅ FX conversion completed: ${dep.amount} ${dep.currency} = ${fx.amountReceived} USD`);
      
      stablecoin = 'USDC';
      amountToMint = fx.amountReceived;
      
    } else {
      throw new Error(`Unsupported deposit currency: ${dep.currency}`);
    }

    // Create mint job
    const mint: MintJob = {
      id: randomUUID(),
      depositId: dep.id,
      stablecoin,
      amount: amountToMint,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mints.set(dep.id, mint);
    console.log(`🪙 Created mint job: ${mint.id} for ${amountToMint} ${stablecoin}`);

    // Call Circle API to mint stablecoins
    const idemKey = generateIdempotencyKey(depositId, `mint_${stablecoin.toLowerCase()}`);
    const circleResult = stablecoin === 'USDC'
      ? await circle.mintUSDC(amountToMint, idemKey)
      : await circle.mintEURC(amountToMint, idemKey);

    // Wait for Circle transfer to complete
    await circle.waitComplete(circleResult.id);

    // Update mint job with Circle details
    mint.status = 'complete';
    mint.providerTxId = circleResult.id;
    mint.circleTransferId = circleResult.circleTransferId;
    mint.updatedAt = new Date().toISOString();

    // Credit user's stablecoin balance
    creditUser(dep.userId, stablecoin, amountToMint, { 
      depositId: dep.id, 
      providerTxId: circleResult.id,
      fxTradeId: fxTrade?.id 
    });

    // Update deposit status
    dep.status = 'converted';
    dep.updatedAt = new Date().toISOString();

    console.log(`✅ Conversion completed successfully!`);
    console.log(`💰 User ${dep.userId} credited with ${amountToMint} ${stablecoin}`);

    return {
      success: true,
      deposit: dep,
      mint,
      fxTrade
    };

  } catch (error: any) {
    console.error(`❌ Conversion failed for deposit ${depositId}:`, error.message);
    
    // Update deposit status to failed
    dep.status = 'failed';
    dep.updatedAt = new Date().toISOString();

    // Update mint job status if it exists
    const mint = mints.get(depositId);
    if (mint) {
      mint.status = 'failed';
      mint.updatedAt = new Date().toISOString();
    }

    return {
      success: false,
      error: error.message,
      deposit: dep,
      mint: mint || undefined,
      fxTrade: getFxByDeposit(depositId)
    };
  }
}

/**
 * Get deposit by ID
 * @param id - Deposit ID
 * @returns Deposit or undefined
 */
export function getDeposit(id: string): FiatDeposit | undefined {
  return deposits.get(id);
}

/**
 * Get mint job for deposit
 * @param depositId - Deposit ID
 * @returns Mint job or undefined
 */
export function getMintForDeposit(depositId: string): MintJob | undefined {
  return mints.get(depositId);
}

/**
 * Get FX trade for deposit
 * @param depositId - Deposit ID
 * @returns FX trade or undefined
 */
export function getFxByDeposit(depositId: string): FxTrade | undefined {
  return [...fxTrades.values()].find(x => x.depositId === depositId);
}

/**
 * Get all deposits for a user
 * @param userId - User ID
 * @returns Array of deposits
 */
export function getUserDeposits(userId: string): FiatDeposit[] {
  return [...deposits.values()].filter(dep => dep.userId === userId);
}

/**
 * Get conversion history for a user
 * @param userId - User ID
 * @returns Array of conversions with details
 */
export function getUserConversionHistory(userId: string): any[] {
  const userDeposits = getUserDeposits(userId);
  
  return userDeposits.map(dep => ({
    deposit: dep,
    mint: getMintForDeposit(dep.id),
    fxTrade: getFxByDeposit(dep.id)
  }));
}

/**
 * Retry failed conversion
 * @param depositId - Deposit ID to retry
 * @returns Conversion result
 */
export async function retryConversion(depositId: string): Promise<ConversionResponse> {
  console.log(`🔄 Retrying conversion for deposit: ${depositId}`);
  
  const dep = deposits.get(depositId);
  if (!dep) {
    throw new Error('Deposit not found');
  }

  if (dep.status !== 'failed') {
    throw new Error('Can only retry failed deposits');
  }

  // Clear any existing mint job
  mints.delete(depositId);
  
  // Retry conversion
  return await convertDeposit(depositId);
}

/**
 * Get system statistics
 * @returns System statistics
 */
export function getSystemStats(): any {
  const totalDeposits = deposits.size;
  const successfulConversions = [...deposits.values()].filter(d => d.status === 'converted').length;
  const failedConversions = [...deposits.values()].filter(d => d.status === 'failed').length;
  const pendingConversions = [...deposits.values()].filter(d => d.status === 'pending').length;

  const totalVolume = [...deposits.values()]
    .filter(d => d.status === 'converted')
    .reduce((sum, dep) => sum + dep.amount, 0);

  return {
    totalDeposits,
    successfulConversions,
    failedConversions,
    pendingConversions,
    totalVolume,
    successRate: totalDeposits > 0 ? (successfulConversions / totalDeposits) * 100 : 0
  };
}












