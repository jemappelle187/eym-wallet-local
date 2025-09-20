import axios from 'axios';
import { ENV } from '../env';
import { CircleTransferRequest, CircleTransferResponse } from '../types';

// Runtime simulation flag that can be toggled via debug route
let SIMULATE = (ENV.CIRCLE_SANDBOX === true);

export function getCircleSimulateMode() {
  return SIMULATE;
}

export function setCircleSimulateMode(v: boolean) {
  SIMULATE = v;
}

function circleClient() {
  // For real calls, use CIRCLE_BASE_URL (set to sandbox or prod by env)
  return axios.create({
    baseURL: ENV.CIRCLE_BASE_URL,
    headers: {
      Authorization: `Bearer ${ENV.CIRCLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
}

function sleep(ms: number) { 
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
    
    if (SIMULATE) {
      // Simulate minting in sandbox mode
      await sleep(2000); // Simulate API delay
      console.log(`✅ Sandbox: Successfully minted ${amountUsd} USDC`);
      return { 
        id: `sim_usdc_${idemKey}`, 
        amount: amountUsd, 
        status: 'complete',
        circleTransferId: `circle_sim_${Date.now()}`
      };
    }

    try {
      // Real Circle API call for production
      const transferRequest: CircleTransferRequest = {
        idempotencyKey: idemKey,
        destination: {
          type: 'wallet',
          address: ENV.CIRCLE_TREASURY_USDC_ADDRESS || 'YOUR_TREASURY_USDC_ADDRESS'
        },
        amount: {
          amount: amountUsd.toFixed(2),
          currency: 'USD'
        },
        token: 'USDC'
      };

      console.log('🔄 Calling Circle API for USDC mint...');
      const { data } = await circleClient().post<CircleTransferResponse>('/transfers', transferRequest);
      
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
    
    if (SIMULATE) {
      // Simulate minting in sandbox mode
      await sleep(2000); // Simulate API delay
      console.log(`✅ Sandbox: Successfully minted ${amountEur} EURC`);
      return { 
        id: `sim_eurc_${idemKey}`, 
        amount: amountEur, 
        status: 'complete',
        circleTransferId: `circle_sim_${Date.now()}`
      };
    }

    try {
      // Real Circle API call for production
      const transferRequest: CircleTransferRequest = {
        idempotencyKey: idemKey,
        destination: {
          type: 'wallet',
          address: ENV.CIRCLE_TREASURY_EURC_ADDRESS || 'YOUR_TREASURY_EURC_ADDRESS'
        },
        amount: {
          amount: amountEur.toFixed(2),
          currency: 'EUR'
        },
        token: 'EURC'
      };

      console.log('🔄 Calling Circle API for EURC mint...');
      const { data } = await circleClient().post<CircleTransferResponse>('/transfers', transferRequest);
      
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
    
    if (SIMULATE) {
      // Simulate completion in sandbox
      await sleep(3000);
      return { 
        id: providerTxId, 
        status: 'complete',
        circleTransferId: providerTxId
      };
    }

    // Poll Circle API for transfer status
    for (let i = 0; i < 30; i++) {
      try {
        const { data } = await circleClient().get(`/transfers/${providerTxId}`);
        const status = data.data.status;
        
        console.log(`📊 Transfer ${providerTxId} status: ${status}`);
        
        if (status === 'complete') {
          return { 
            id: providerTxId, 
            status,
            circleTransferId: providerTxId
          };
        }
        
        if (status === 'failed') {
          throw new Error(`Circle transfer failed: ${data.data.failureReason || 'Unknown error'}`);
        }
        
        // Wait before next poll
        await sleep(1000);
      } catch (error: any) {
        console.error(`❌ Error polling transfer status:`, error.message);
        throw new Error(`Failed to check transfer status: ${error.message}`);
      }
    }
    
    throw new Error('Timeout waiting for Circle transfer to complete');
  },

  /**
   * Get transfer details
   * @param transferId - Circle transfer ID
   * @returns Transfer details
   */
  async getTransfer(transferId: string) {
    if (SIMULATE) {
      return {
        id: transferId,
        status: 'complete',
        amount: { amount: '100.00', currency: 'USD' },
        token: 'USDC',
        createdAt: new Date().toISOString()
      };
    }

    try {
      const { data } = await circleClient().get(`/transfers/${transferId}`);
      return data.data;
    } catch (error: any) {
      console.error('❌ Error getting transfer details:', error.message);
      throw new Error(`Failed to get transfer details: ${error.message}`);
    }
  },

  /**
   * Get account balances (for treasury management)
   * @returns Account balances
   */
  async getAccountBalances() {
    if (SIMULATE) {
      return {
        USD: 10000.00,
        EUR: 8000.00,
        USDC: 5000.00,
        EURC: 4000.00
      };
    }

    try {
      const { data } = await circleClient().get('/accounts');
      return data.data;
    } catch (error: any) {
      console.error('❌ Error getting account balances:', error.message);
      throw new Error(`Failed to get account balances: ${error.message}`);
    }
  }
};










