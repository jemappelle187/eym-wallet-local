import axios from 'axios';
import { ENV } from '../env';
import { FxQuote, FiatCurrency } from '../types';

/**
 * FX Partner service for currency conversion
 * This handles conversions like GHS -> USD, AED -> USD, NGN -> USD
 */
export const fxPartner = {
  /**
   * Convert GHS to USD via FX partner
   * @param amountGhs - Amount in Ghanaian Cedis
   * @returns FX quote with rate and USD amount
   */
  async convertGHS2USD(amountGhs: number): Promise<FxQuote> {
    console.log(`💱 Converting ${amountGhs} GHS to USD...`);
    
    if (!ENV.FX_PARTNER_BASE_URL || !ENV.FX_API_KEY) {
      // Fallback to simulated conversion
      return this.simulateGHS2USD(amountGhs);
    }

    try {
      const response = await axios.post(`${ENV.FX_PARTNER_BASE_URL}/convert`, {
        from: 'GHS',
        to: 'USD',
        amount: amountGhs,
        apiKey: ENV.FX_API_KEY
      }, {
        timeout: 10000
      });

      const { rate, spreadBps, usdReceived, partnerRef } = response.data;
      
      console.log(`✅ FX conversion: ${amountGhs} GHS = ${usdReceived} USD (rate: ${rate})`);
      
      return {
        rate,
        spreadBps,
        amountReceived: usdReceived,
        partnerRef,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
      };
    } catch (error: any) {
      console.error('❌ FX partner conversion failed:', error.message);
      console.log('🔄 Falling back to simulated conversion...');
      return this.simulateGHS2USD(amountGhs);
    }
  },

  /**
   * Convert AED to USD via FX partner
   * @param amountAed - Amount in UAE Dirhams
   * @returns FX quote with rate and USD amount
   */
  async convertAED2USD(amountAed: number): Promise<FxQuote> {
    console.log(`💱 Converting ${amountAed} AED to USD...`);
    
    if (!ENV.FX_PARTNER_BASE_URL || !ENV.FX_API_KEY) {
      return this.simulateAED2USD(amountAed);
    }

    try {
      const response = await axios.post(`${ENV.FX_PARTNER_BASE_URL}/convert`, {
        from: 'AED',
        to: 'USD',
        amount: amountAed,
        apiKey: ENV.FX_API_KEY
      }, {
        timeout: 10000
      });

      const { rate, spreadBps, usdReceived, partnerRef } = response.data;
      
      console.log(`✅ FX conversion: ${amountAed} AED = ${usdReceived} USD (rate: ${rate})`);
      
      return {
        rate,
        spreadBps,
        amountReceived: usdReceived,
        partnerRef,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
      };
    } catch (error: any) {
      console.error('❌ FX partner conversion failed:', error.message);
      return this.simulateAED2USD(amountAed);
    }
  },

  /**
   * Convert NGN to USD via FX partner
   * @param amountNgn - Amount in Nigerian Naira
   * @returns FX quote with rate and USD amount
   */
  async convertNGN2USD(amountNgn: number): Promise<FxQuote> {
    console.log(`💱 Converting ${amountNgn} NGN to USD...`);
    
    if (!ENV.FX_PARTNER_BASE_URL || !ENV.FX_API_KEY) {
      return this.simulateNGN2USD(amountNgn);
    }

    try {
      const response = await axios.post(`${ENV.FX_PARTNER_BASE_URL}/convert`, {
        from: 'NGN',
        to: 'USD',
        amount: amountNgn,
        apiKey: ENV.FX_API_KEY
      }, {
        timeout: 10000
      });

      const { rate, spreadBps, usdReceived, partnerRef } = response.data;
      
      console.log(`✅ FX conversion: ${amountNgn} NGN = ${usdReceived} USD (rate: ${rate})`);
      
      return {
        rate,
        spreadBps,
        amountReceived: usdReceived,
        partnerRef,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
      };
    } catch (error: any) {
      console.error('❌ FX partner conversion failed:', error.message);
      return this.simulateNGN2USD(amountNgn);
    }
  },

  /**
   * Generic currency conversion method
   * @param fromCurrency - Source currency
   * @param toCurrency - Target currency
   * @param amount - Amount to convert
   * @returns FX quote
   */
  async convertCurrency(fromCurrency: FiatCurrency, toCurrency: 'USD' | 'EUR', amount: number): Promise<FxQuote> {
    console.log(`💱 Converting ${amount} ${fromCurrency} to ${toCurrency}...`);
    
    // Handle direct conversions (USD -> USD, EUR -> EUR)
    if (fromCurrency === toCurrency) {
      return {
        rate: 1,
        spreadBps: 0,
        amountReceived: amount,
        partnerRef: 'DIRECT',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
    }

    // Handle specific currency pairs
    switch (fromCurrency) {
      case 'GHS':
        return toCurrency === 'USD' 
          ? await this.convertGHS2USD(amount)
          : await this.convertGHS2EUR(amount);
      
      case 'AED':
        return toCurrency === 'USD'
          ? await this.convertAED2USD(amount)
          : await this.convertAED2EUR(amount);
      
      case 'NGN':
        return toCurrency === 'USD'
          ? await this.convertNGN2USD(amount)
          : await this.convertNGN2EUR(amount);
      
      case 'USD':
        return toCurrency === 'EUR'
          ? await this.convertUSD2EUR(amount)
          : { rate: 1, spreadBps: 0, amountReceived: amount, partnerRef: 'DIRECT', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() };
      
      case 'EUR':
        return toCurrency === 'USD'
          ? await this.convertEUR2USD(amount)
          : { rate: 1, spreadBps: 0, amountReceived: amount, partnerRef: 'DIRECT', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() };
      
      default:
        throw new Error(`Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`);
    }
  },

  // Simulated conversion methods for development/testing
  simulateGHS2USD(amountGhs: number): FxQuote {
    const midRate = 15.0; // 1 USD = 15 GHS (example rate)
    const spreadBps = 40; // 0.40% spread
    const effectiveRate = midRate * (1 + spreadBps / 10000);
    const usdReceived = amountGhs / effectiveRate;
    
    console.log(`🧪 Simulated FX: ${amountGhs} GHS = ${usdReceived.toFixed(2)} USD (rate: ${effectiveRate.toFixed(4)})`);
    
    return {
      rate: effectiveRate,
      spreadBps,
      amountReceived: usdReceived,
      partnerRef: 'SIM-FX-GHS-USD',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  },

  simulateAED2USD(amountAed: number): FxQuote {
    const midRate = 3.67; // 1 USD = 3.67 AED (fixed rate)
    const spreadBps = 25; // 0.25% spread
    const effectiveRate = midRate * (1 + spreadBps / 10000);
    const usdReceived = amountAed / effectiveRate;
    
    console.log(`🧪 Simulated FX: ${amountAed} AED = ${usdReceived.toFixed(2)} USD (rate: ${effectiveRate.toFixed(4)})`);
    
    return {
      rate: effectiveRate,
      spreadBps,
      amountReceived: usdReceived,
      partnerRef: 'SIM-FX-AED-USD',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  },

  simulateNGN2USD(amountNgn: number): FxQuote {
    const midRate = 750; // 1 USD = 750 NGN (example rate)
    const spreadBps = 50; // 0.50% spread
    const effectiveRate = midRate * (1 + spreadBps / 10000);
    const usdReceived = amountNgn / effectiveRate;
    
    console.log(`🧪 Simulated FX: ${amountNgn} NGN = ${usdReceived.toFixed(2)} USD (rate: ${effectiveRate.toFixed(4)})`);
    
    return {
      rate: effectiveRate,
      spreadBps,
      amountReceived: usdReceived,
      partnerRef: 'SIM-FX-NGN-USD',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  },

  // Additional conversion methods
  async convertGHS2EUR(amountGhs: number): Promise<FxQuote> {
    const usdQuote = await this.convertGHS2USD(amountGhs);
    const eurRate = 0.92; // USD to EUR rate
    const eurReceived = usdQuote.amountReceived * eurRate;
    
    return {
      rate: usdQuote.rate / eurRate,
      spreadBps: usdQuote.spreadBps + 10, // Additional spread for EUR
      amountReceived: eurReceived,
      partnerRef: usdQuote.partnerRef?.replace('USD', 'EUR'),
      expiresAt: usdQuote.expiresAt
    };
  },

  async convertAED2EUR(amountAed: number): Promise<FxQuote> {
    const usdQuote = await this.convertAED2USD(amountAed);
    const eurRate = 0.92;
    const eurReceived = usdQuote.amountReceived * eurRate;
    
    return {
      rate: usdQuote.rate / eurRate,
      spreadBps: usdQuote.spreadBps + 10,
      amountReceived: eurReceived,
      partnerRef: usdQuote.partnerRef?.replace('USD', 'EUR'),
      expiresAt: usdQuote.expiresAt
    };
  },

  async convertNGN2EUR(amountNgn: number): Promise<FxQuote> {
    const usdQuote = await this.convertNGN2USD(amountNgn);
    const eurRate = 0.92;
    const eurReceived = usdQuote.amountReceived * eurRate;
    
    return {
      rate: usdQuote.rate / eurRate,
      spreadBps: usdQuote.spreadBps + 10,
      amountReceived: eurReceived,
      partnerRef: usdQuote.partnerRef?.replace('USD', 'EUR'),
      expiresAt: usdQuote.expiresAt
    };
  },

  async convertUSD2EUR(amountUsd: number): Promise<FxQuote> {
    const eurRate = 0.92;
    const eurReceived = amountUsd * eurRate;
    
    return {
      rate: eurRate,
      spreadBps: 10,
      amountReceived: eurReceived,
      partnerRef: 'SIM-FX-USD-EUR',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  },

  async convertEUR2USD(amountEur: number): Promise<FxQuote> {
    const usdRate = 1.08; // 1 EUR = 1.08 USD
    const usdReceived = amountEur * usdRate;
    
    return {
      rate: usdRate,
      spreadBps: 10,
      amountReceived: usdReceived,
      partnerRef: 'SIM-FX-EUR-USD',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  }
};












