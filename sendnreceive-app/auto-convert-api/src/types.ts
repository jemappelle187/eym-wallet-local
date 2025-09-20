// Currency types supported by EYM Wallet
export type FiatCurrency = 'USD' | 'EUR' | 'GHS' | 'AED' | 'NGN';
export type Stablecoin = 'USDC' | 'EURC';

// Payment method types from your mobile app
export type PaymentMethod = 'card' | 'bank' | 'mobile_money' | 'paypal' | 'apple_pay' | 'google_pay';

// Deposit status tracking
export type DepositStatus = 'pending' | 'converted' | 'failed' | 'processing';

// Conversion status tracking
export type ConversionStatus = 'pending' | 'complete' | 'failed' | 'processing';

// FX trade status
export type FxTradeStatus = 'pending' | 'complete' | 'failed';

// Main data structures
export interface FiatDeposit {
  id: string;
  userId: string;
  currency: FiatCurrency;
  amount: number; // Using number for simplicity, consider BigNumber for production
  status: DepositStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MintJob {
  id: string;
  depositId: string;
  stablecoin: Stablecoin;
  amount: number;
  status: ConversionStatus;
  providerTxId?: string;
  circleTransferId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FxTrade {
  id: string;
  depositId: string;
  fromCurrency: FiatCurrency;
  toCurrency: 'USD' | 'EUR';
  rate: number; // Exchange rate used
  spreadBps: number; // Spread in basis points
  amountReceived: number; // Amount received after FX conversion
  partnerRef?: string;
  status: FxTradeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Balance {
  USDC: number;
  EURC: number;
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types
export interface DepositWebhookPayload {
  id?: string;
  userId: string;
  currency: FiatCurrency;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  description?: string;
}

export interface ConversionRequest {
  depositId: string;
  userId: string;
  currency: FiatCurrency;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface ConversionResponse {
  success: boolean;
  deposit?: FiatDeposit;
  mint?: MintJob;
  fxTrade?: FxTrade;
  error?: string;
}

export interface BalanceResponse {
  success: boolean;
  userId: string;
  balance: Balance;
  error?: string;
}

// Circle API types
export interface CircleTransferRequest {
  idempotencyKey: string;
  destination: {
    type: 'wallet';
    address: string;
  };
  amount: {
    amount: string;
    currency: string;
  };
  token: 'USDC' | 'EURC';
}

export interface CircleTransferResponse {
  data: {
    id: string;
    status: string;
    amount: {
      amount: string;
      currency: string;
    };
    token: string;
    createdAt: string;
  };
}

// FX Partner types
export interface FxQuote {
  rate: number;
  spreadBps: number;
  amountReceived: number;
  partnerRef?: string;
  expiresAt: string;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Webhook types for payment providers
export interface StripeWebhookPayload {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  metadata: {
    userId?: string;
    description?: string;
  };
}

export interface PlaidWebhookPayload {
  webhook_type: string;
  webhook_code: string;
  item_id: string;
  account_id: string;
  amount: number;
  currency: string;
  metadata: {
    userId?: string;
    description?: string;
  };
}












