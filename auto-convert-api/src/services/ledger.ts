import { Balance, Stablecoin } from '../types';
import { randomUUID } from 'crypto';

// In-memory stores (replace with database in production)
const userBalances = new Map<string, Balance>();
const journal: any[] = [];

/**
 * Get or create user balance
 * @param userId - The user ID
 * @returns The user's balance
 */
function getUserBalance(userId: string): Balance {
  if (!userBalances.has(userId)) {
    userBalances.set(userId, { 
      USDC: 0, 
      EURC: 0, 
      lastUpdated: new Date().toISOString() 
    });
  }
  return userBalances.get(userId)!;
}

/**
 * Credit user's stablecoin balance
 * @param userId - The user ID
 * @param token - The stablecoin type (USDC or EURC)
 * @param amount - The amount to credit
 * @param meta - Additional metadata for the transaction
 */
export function creditUser(userId: string, token: Stablecoin, amount: number, meta?: any): void {
  const bal = getUserBalance(userId);
  bal[token] += amount;
  bal.lastUpdated = new Date().toISOString();
  
  journal.push({ 
    id: randomUUID(), 
    timestamp: new Date().toISOString(), 
    type: 'credit', 
    userId, 
    token, 
    amount, 
    meta 
  });
  
  console.log(`💰 Credited ${amount} ${token} to user ${userId}`);
}

/**
 * Debit user's stablecoin balance
 * @param userId - The user ID
 * @param token - The stablecoin type (USDC or EURC)
 * @param amount - The amount to debit
 * @param meta - Additional metadata for the transaction
 * @throws Error if insufficient balance
 */
export function debitUser(userId: string, token: Stablecoin, amount: number, meta?: any): void {
  const bal = getUserBalance(userId);
  if (bal[token] < amount) {
    throw new Error(`Insufficient ${token} balance. Available: ${bal[token]}, Required: ${amount}`);
  }
  
  bal[token] -= amount;
  bal.lastUpdated = new Date().toISOString();
  
  journal.push({ 
    id: randomUUID(), 
    timestamp: new Date().toISOString(), 
    type: 'debit', 
    userId, 
    token, 
    amount, 
    meta 
  });
  
  console.log(`💸 Debited ${amount} ${token} from user ${userId}`);
}

/**
 * Get user's current balance
 * @param userId - The user ID
 * @returns The user's current balance
 */
export function getBalance(userId: string): Balance {
  return getUserBalance(userId);
}

/**
 * Get transaction journal (for debugging/auditing)
 * @returns Array of all transactions
 */
export function getJournal(): any[] {
  return journal;
}

/**
 * Get user's transaction history
 * @param userId - The user ID
 * @returns Array of user's transactions
 */
export function getUserTransactions(userId: string): any[] {
  return journal.filter(entry => entry.userId === userId);
}

/**
 * Transfer stablecoins between users
 * @param fromUserId - Source user ID
 * @param toUserId - Destination user ID
 * @param token - The stablecoin type
 * @param amount - The amount to transfer
 * @param meta - Additional metadata
 */
export function transferBetweenUsers(
  fromUserId: string, 
  toUserId: string, 
  token: Stablecoin, 
  amount: number, 
  meta?: any
): void {
  debitUser(fromUserId, token, amount, { ...meta, transferType: 'outgoing', toUserId });
  creditUser(toUserId, token, amount, { ...meta, transferType: 'incoming', fromUserId });
  
  console.log(`🔄 Transferred ${amount} ${token} from ${fromUserId} to ${toUserId}`);
}

/**
 * Get total system balances (for admin/reporting)
 * @returns Total balances across all users
 */
export function getSystemTotals(): Balance {
  let totalUSDC = 0;
  let totalEURC = 0;
  
  for (const balance of userBalances.values()) {
    totalUSDC += balance.USDC;
    totalEURC += balance.EURC;
  }
  
  return {
    USDC: totalUSDC,
    EURC: totalEURC,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Reset user balance (for testing)
 * @param userId - The user ID
 */
export function resetUserBalance(userId: string): void {
  userBalances.delete(userId);
  console.log(`🔄 Reset balance for user ${userId}`);
}

/**
 * Get balance snapshot for a specific timestamp
 * @param userId - The user ID
 * @param timestamp - The timestamp to get balance for
 * @returns Balance at that timestamp (simplified implementation)
 */
export function getBalanceAtTime(userId: string, timestamp: string): Balance {
  // This is a simplified implementation
  // In production, you'd want to calculate this from the journal
  return getUserBalance(userId);
}












