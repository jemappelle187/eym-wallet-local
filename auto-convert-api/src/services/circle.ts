import axios from 'axios';
import { ENV } from '../env';
import { CircleTransferRequest, CircleTransferResponse } from '../types';

// Create axios instance for Circle API
const circleApi = axios.create({
  baseURL: ENV.CIRCLE_BASE_URL,
  headers: { 
    Authorization: `Bearer ${ENV.CIRCLE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 second timeout
});

// Treasury wallet addresses (replace with your actual addresses)
const TREASURY_ADDRESSES = {
  USDC: ENV.CIRCLE_SANDBOX ? '0x1234567890123456789012345678901234567890' : 'YOUR_PRODUCTION_USDC_ADDRESS',
  EURC: ENV.CIRCLE_SANDBOX ? '0x0987654321098765432109876543210987654321' : 'YOUR_PRODUCTION_EURC_ADDRESS',
};

/**
 * Sleep utility for polling
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Circle API service for minting stablecoins
 */
export const circle = {
  /**
   * Mint USDC from settled USD balance at Circle
   * @param amountUsd - Amount in USD to mint
   * @param idemKey - Idempotency key
   * @returns Mint result
   */
  async mintUSDC(amountUsd: number, idemKey: string) {
    console.log(`🪙 Minting ${amountUsd} USDC with idempotency key: ${idemKey}`);
    
    if (ENV.CIRCLE_SANDBOX) {
      // Simulate minting in sandbox mode
      await sleep(2000); // Simulate API delay
      console.log(`✅ Sandbox: Successfully minted ${amountUsd} USDC`);
      return { 
        id: `sim_usdc_${idemKey}`, 
        amount: amountUsd, 
        status: 'complete',
        circleTransferId: `sim_transfer_${Date.now()}`
      };
    }

    try {
      const transferRequest: CircleTransferRequest = {
        idempotencyKey: idemKey,
        destination: {
          type: 'wallet',
          address: TREASURY_ADDRESSES.USDC
        },
        amount: {
          amount: amountUsd.toFixed(2),
          currency: 'USD'
        },
        token: 'USDC'
      };

      console.log('🔄 Calling Circle API for USDC mint...');
      const { data } = await circleApi.post<CircleTransferResponse>('/transfers', transferRequest);
      
      console.log(`✅ Circle API response:`, data);
      
      return { 
        id: data.data.id, 
        amount: amountUsd, 
        status: 'pending',
        circleTransferId: data.data.id
      };
    } catch (error: any) {
      console.error('❌ Circle USDC mint failed:', error.response?.data || error.message);
      throw new Error(`USDC mint failed: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Mint EURC from settled EUR balance at Circle (SEPA funded)
   * @param amountEur - Amount in EUR to mint
   * @param idemKey - Idempotency key
   * @returns Mint result
   */
  async mintEURC(amountEur: number, idemKey: string) {
    console.log(`🪙 Minting ${amountEur} EURC with idempotency key: ${idemKey}`);
    
    if (ENV.CIRCLE_SANDBOX) {
      // Simulate minting in sandbox mode
      await sleep(2000); // Simulate API delay
      console.log(`✅ Sandbox: Successfully minted ${amountEur} EURC`);
      return { 
        id: `sim_eurc_${idemKey}`, 
        amount: amountEur, 
        status: 'complete',
        circleTransferId: `sim_transfer_${Date.now()}`
      };
    }

    try {
      const transferRequest: CircleTransferRequest = {
        idempotencyKey: idemKey,
        destination: {
          type: 'wallet',
          address: TREASURY_ADDRESSES.EURC
        },
        amount: {
          amount: amountEur.toFixed(2),
          currency: 'EUR'
        },
        token: 'EURC'
      };

      console.log('🔄 Calling Circle API for EURC mint...');
      const { data } = await circleApi.post<CircleTransferResponse>('/transfers', transferRequest);
      
      console.log(`✅ Circle API response:`, data);
      
      return { 
        id: data.data.id, 
        amount: amountEur, 
        status: 'pending',
        circleTransferId: data.data.id
      };
    } catch (error: any) {
      console.error('❌ Circle EURC mint failed:', error.response?.data || error.message);
      throw new Error(`EURC mint failed: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Poll transfer/mint status until complete
   * @param providerTxId - Circle transfer ID
   * @returns Transfer status
   */
  async waitComplete(providerTxId: string) {
    console.log(`⏳ Waiting for Circle transfer ${providerTxId} to complete...`);
    
    if (ENV.CIRCLE_SANDBOX) {
      // Simulate completion in sandbox
      await sleep(3000);
      return { id: providerTxId, status: 'complete' };
    }

    // Poll for completion (max 30 attempts, 2 seconds apart)
    for (let i = 0; i < 30; i++) {
      try {
        const { data } = await circleApi.get(`/transfers/${providerTxId}`);
        const status = data.data.status;
        
        console.log(`📊 Transfer ${providerTxId} status: ${status}`);
        
        if (status === 'complete') {
          console.log(`✅ Transfer ${providerTxId} completed successfully`);
          return { id: providerTxId, status };
        }
        
        if (status === 'failed') {
          console.error(`❌ Transfer ${providerTxId} failed`);
          throw new Error('Circle transfer failed');
        }
        
        // Wait before next poll
        await sleep(2000);
      } catch (error: any) {
        console.error(`❌ Error polling transfer ${providerTxId}:`, error.message);
        throw new Error(`Transfer polling failed: ${error.message}`);
      }
    }
    
    throw new Error('Timeout waiting for Circle transfer completion');
  },

  /**
   * Get transfer details
   * @param transferId - Circle transfer ID
   * @returns Transfer details
   */
  async getTransfer(transferId: string) {
    if (ENV.CIRCLE_SANDBOX) {
      return {
        id: transferId,
        status: 'complete',
        amount: { amount: '100.00', currency: 'USD' },
        token: 'USDC',
        createdAt: new Date().toISOString()
      };
    }

    try {
      const { data } = await circleApi.get(`/transfers/${transferId}`);
      return data.data;
    } catch (error: any) {
      console.error(`❌ Error getting transfer ${transferId}:`, error.message);
      throw new Error(`Failed to get transfer: ${error.message}`);
    }
  },

  /**
   * Get account balances (if using Circle Accounts)
   * @returns Account balances
   */
  async getAccountBalances() {
    if (ENV.CIRCLE_SANDBOX) {
      return {
        USD: 10000.00,
        EUR: 8000.00
      };
    }

    try {
      const { data } = await circleApi.get('/accounts');
      return data.data;
    } catch (error: any) {
      console.error('❌ Error getting account balances:', error.message);
      throw new Error(`Failed to get account balances: ${error.message}`);
    }
  }
};












