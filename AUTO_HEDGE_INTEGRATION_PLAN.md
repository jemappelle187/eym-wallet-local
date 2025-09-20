# Auto-Hedge (GMCR) Integration Plan

## Executive Summary

This document outlines the integration of Auto-Hedge (Guaranteed Minimum Conversion Rate - GMCR) with the existing Circle Mint infrastructure and evaluates where Utila fits for treasury-side operations. The integration maintains end-user non-custodial wallets while adding sophisticated hedging capabilities.

## 1. Current Stack Snapshot

### Mobile App
- **Framework**: React Native with Expo (v53.0.19)
- **State Management**: React Context API (TransactionContext, AuthContext)
- **Navigation**: React Navigation v7 (Stack, Bottom Tabs)
- **Networking**: Axios, fetch API with custom FX quote system
- **Key SDKs**: 
  - `@expo/vector-icons` (v14.1.0)
  - `expo-blur` (v14.1.5) for glassmorphism effects
  - `expo-secure-store` (v14.2.3) for secure storage
  - `expo-local-authentication` (v16.0.5)

### Backend API
- **Language/Runtime**: Node.js with TypeScript
- **Framework**: Express.js with modular router architecture
- **Database**: In-memory storage (Map-based) - needs production DB
- **Message Bus**: None currently - needs Redis/RabbitMQ for production
- **Caching**: In-memory FX rate cache (60s TTL)
- **Background Jobs**: None - needs job queue system
- **Auth**: Webhook secret-based authentication
- **Rate Limiting**: `rate-limiter-flexible` (100 req/15min in production)

### Infrastructure
- **Cloud**: Vercel deployment configured
- **IaC**: None currently - needs Terraform/CDK
- **CI/CD**: Basic npm scripts, needs GitHub Actions
- **Secrets Management**: Environment variables (needs Vault/Parameter Store)
- **Observability**: Basic console logging (needs structured logging)

### Wallets
- **End-User Wallets**: Non-custodial (user controls private keys)
- **Implementation**: Circle Programmable Wallets (Developer-Controlled Wallets)
- **Blockchains**: Solana (SOL-DEVNET), Base (BASE-SEPOLIA)
- **Account Types**: EOA (Externally Owned Accounts) and SCA (Smart Contract Accounts)
- **Treasury Wallets**: Circle-managed treasury addresses for minting/redeeming

### Treasury Operations
- **Current**: Circle Mint API for USDC/EURC minting/redeeming
- **Treasury Addresses**: Configured via `TREASURY_ADDRESS` env var
- **Custody Platform**: None currently - Utila integration planned
- **Operations**: Sandbox mode with faucet drips for testing

### Payments/FX
- **Circle Mint**: Integrated for stablecoin operations
- **FX Providers**: 
  - Primary: Fixer.io (paid)
  - Fallback: Frankfurter.app, Open ER API (free)
  - Demo: Hardcoded fallback rates
- **Local Payout Rails**: MTN Mobile Money (Ghana), Plaid (US bank transfers)
- **FX Spread**: 40 basis points (0.40%) margin

## 2. Code Map

### FX Conversion & Quotes
- **File**: `auto-convert-api/src/services/fx.ts`
- **Key Functions**: `getQuote()`, `getRate()`, `applySpread()`
- **Invocation**: `/v1/fx/quote` endpoint
- **Cache**: In-memory Map with 60s TTL

### Remittance Orchestration
- **File**: `auto-convert-api/src/services/deposits.ts`
- **Key Functions**: `processDeposit()`
- **Invocation**: `/v1/deposits/webhook` endpoint
- **Flow**: Deposit → FX conversion → Circle mint → User wallet

### Stablecoin Mint/Burn
- **File**: `auto-convert-api/src/services/circle.ts`
- **Key Functions**: `mintUSDC()`, `mintEURC()`, `faucetDrip()`
- **Invocation**: Called from deposit processing
- **Status**: Sandbox mode only (needs KYB approval for production)

### Payouts
- **File**: `auto-convert-api/src/routes/momo.ts` (MTN Mobile Money)
- **File**: `auto-convert-api/src/routes/bank-transfers.ts` (Plaid)
- **Key Functions**: Mobile money collections, bank transfer processing
- **Invocation**: Various payout endpoints

### Webhooks
- **File**: `auto-convert-api/src/routes/deposits.ts`
- **Key Functions**: Webhook authentication, idempotency handling
- **Invocation**: External payment providers → `/v1/deposits/webhook`

### Premium/Fees Logic
- **File**: `auto-convert-api/src/services/fx.ts` (FX spread)
- **File**: Mobile app components (fee display)
- **Key Functions**: `applySpread()` (40 bps margin)
- **Invocation**: Applied during FX conversion

## 3. Integration Points for Auto-Hedge (GMCR)

### 3.1 GET/POST /quotes
**Insertion Point**: `auto-convert-api/src/routes/fx.ts`
**Current**: Basic FX quotes with margin
**Enhancement**: Add GMCR calculation and TTL

```typescript
// New endpoint: GET /v1/fx/quote-with-hedge
interface HedgeQuoteRequest {
  base: string;
  target: string;
  amount: number;
  tenor?: number; // hours, default 24
}

interface HedgeQuoteResponse {
  baseRate: number;
  gmcr: number; // Guaranteed Minimum Conversion Rate
  ttlSec: number;
  expiresAt: string;
  premiumBps: number;
  fxSpreadBps: number;
  allInCostBps: number;
}
```

### 3.2 POST /locks
**Insertion Point**: New route `auto-convert-api/src/routes/hedge-locks.ts`
**Purpose**: Lock in GMCR rate within TTL

```typescript
interface RateLockRequest {
  quoteId: string;
  userId: string;
  amount: number;
  currency: string;
}

interface RateLockResponse {
  lockId: string;
  gmcr: number;
  expiresAt: string;
  status: 'locked' | 'expired';
}
```

### 3.3 POST /hedges
**Insertion Point**: New route `auto-convert-api/src/routes/hedges.ts`
**Purpose**: Book NDF/option via hedge provider

```typescript
interface HedgeRequest {
  lockId: string;
  amount: number;
  currency: string;
  tenor: number;
}

interface HedgeResponse {
  hedgeId: string;
  strike: number;
  tenor: number;
  expiryTs: string;
  provider: string;
}
```

### 3.4 POST /treasury/transfers
**Insertion Point**: New route `auto-convert-api/src/routes/treasury.ts`
**Purpose**: USDC treasury movements (Utila-backed)

```typescript
interface TreasuryTransferRequest {
  from: string;
  to: string;
  amount: number;
  currency: string;
  reason: 'hedge_settlement' | 'top_up' | 'rebalance';
}

interface TreasuryTransferResponse {
  transferId: string;
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
}
```

## 4. Adapter Interfaces (Scaffolds)

### 4.1 CircleMintClient
**File**: `auto-convert-api/src/services/circle-mint-client.ts`

```typescript
export interface CircleMintClient {
  mintUSDC(amount: number, idempotencyKey: string): Promise<CircleMintResponse>;
  mintEURC(amount: number, idempotencyKey: string): Promise<CircleMintResponse>;
  redeemUSDC(amount: number, idempotencyKey: string): Promise<CircleMintResponse>;
  redeemEURC(amount: number, idempotencyKey: string): Promise<CircleMintResponse>;
  getBalance(currency: string): Promise<number>;
}

export class CircleMintClientImpl implements CircleMintClient {
  // Implementation with Circle API integration
}
```

### 4.2 FxProviderClient
**File**: `auto-convert-api/src/services/fx-provider-client.ts`

```typescript
export interface FxProviderClient {
  getRateLockQuote(request: RateLockQuoteRequest): Promise<RateLockQuoteResponse>;
  lockRate(request: RateLockRequest): Promise<RateLockResponse>;
  getSupportedCurrencies(): Promise<string[]>;
}

export class NiumFxProviderClient implements FxProviderClient {
  // Nium integration for rate locking
}

export class MockFxProviderClient implements FxProviderClient {
  // Mock implementation for testing
}
```

### 4.3 HedgeProviderClient
**File**: `auto-convert-api/src/services/hedge-provider-client.ts`

```typescript
export interface HedgeProviderClient {
  requestQuote(request: HedgeQuoteRequest): Promise<HedgeQuoteResponse>;
  bookHedge(request: HedgeRequest): Promise<HedgeResponse>;
  getHedgeStatus(hedgeId: string): Promise<HedgeStatus>;
  settleHedge(hedgeId: string): Promise<SettlementResult>;
}

export class ThreeSixtyTHedgeProviderClient implements HedgeProviderClient {
  // 360T integration for NDF/options
}

export class MockHedgeProviderClient implements HedgeProviderClient {
  // Mock implementation for testing
}
```

### 4.4 TreasuryWalletClient
**File**: `auto-convert-api/src/services/treasury-wallet-client.ts`

```typescript
export interface TreasuryWalletClient {
  transfer(request: TreasuryTransferRequest): Promise<TreasuryTransferResponse>;
  getBalance(vaultId: string, currency: string): Promise<number>;
  createVault(name: string): Promise<string>;
  listVaults(): Promise<VaultInfo[]>;
}

export class UtilaTreasuryClient implements TreasuryWalletClient {
  // Utila integration for treasury operations
}

export class LocalTreasuryClient implements TreasuryWalletClient {
  // Local signer implementation (development)
}
```

### 4.5 Dependency Injection
**File**: `auto-convert-api/src/services/service-registry.ts`

```typescript
export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, any> = new Map();

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T {
    return this.services.get(name);
  }
}

// Registration in index.ts
const registry = ServiceRegistry.getInstance();
registry.register('circleMint', new CircleMintClientImpl());
registry.register('fxProvider', new NiumFxProviderClient());
registry.register('hedgeProvider', new ThreeSixtyTHedgeProviderClient());
registry.register('treasury', new UtilaTreasuryClient());
```

## 5. Environment & Secrets Contract

### 5.1 Required Environment Variables

```bash
# Circle API Configuration
CIRCLE_API_KEY=your_circle_api_key
CIRCLE_ACCOUNT_ID=your_circle_account_id
CIRCLE_BASE_URL=https://api.circle.com/v1
CIRCLE_SANDBOX=true

# FX Provider Configuration
FX_PROVIDER_KEY=your_fx_provider_key
FX_PROVIDER=nium  # or 'fixer', 'currencycloud'
FX_MARGIN_BPS=40

# Hedge Provider Configuration
HEDGE_RFP_ENDPOINT=https://api.360t.com/v1/rfq
HEDGE_PROVIDER_KEY=your_hedge_provider_key
HEDGE_PROVIDER=360t  # or 'mock'

# Utila Treasury Configuration
UTILA_API_KEY=your_utila_api_key
UTILA_BASE_URL=https://api.utila.com/v1
UTILA_VAULT_IDS=treasury_vault_1,treasury_vault_2

# Payout Provider Configuration
PAYOUT_PROVIDER_KEY=your_payout_provider_key
MTN_MOMO_COLLECTIONS_SUBSCRIPTION_KEY=your_momo_key
PLAID_SECRET=your_plaid_secret

# Security
WEBHOOK_SECRET=your_webhook_secret
JWT_SECRET=your_jwt_secret
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Database (Production)
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port

# Observability
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
```

### 5.2 CI/CD Integration
**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy Auto-Hedge API
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 6. Data & Ledger Fields

### 6.1 Enhanced Quote Schema
**File**: `auto-convert-api/src/types/hedge.ts`

```typescript
export interface HedgeQuote {
  id: string;
  base: string;
  target: string;
  baseAmount: number;
  baseRate: number;
  gmcr: number; // Guaranteed Minimum Conversion Rate
  ttlSec: number;
  expiresAt: string;
  premiumBps: number;
  fxSpreadBps: number;
  allInCostBps: number;
  targetAmount: number;
  source: 'live' | 'demo' | 'fallback';
  timestamp: number;
}

export interface RateLock {
  id: string;
  quoteId: string;
  userId: string;
  amount: number;
  currency: string;
  gmcr: number;
  expiresAt: string;
  status: 'locked' | 'expired' | 'used';
  createdAt: string;
}

export interface Hedge {
  id: string;
  lockId: string;
  amount: number;
  currency: string;
  tenor: number; // hours
  strike: number;
  expiryTs: string;
  provider: string;
  status: 'pending' | 'active' | 'expired' | 'settled';
  createdAt: string;
}

export interface TreasuryTransfer {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  reason: 'hedge_settlement' | 'top_up' | 'rebalance';
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
  createdAt: string;
}
```

### 6.2 Database Schema (PostgreSQL)
**File**: `auto-convert-api/migrations/001_create_hedge_tables.sql`

```sql
-- Hedge quotes table
CREATE TABLE hedge_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base VARCHAR(3) NOT NULL,
  target VARCHAR(3) NOT NULL,
  base_amount DECIMAL(20,8) NOT NULL,
  base_rate DECIMAL(20,8) NOT NULL,
  gmcr DECIMAL(20,8) NOT NULL,
  ttl_sec INTEGER NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  premium_bps INTEGER NOT NULL,
  fx_spread_bps INTEGER NOT NULL,
  all_in_cost_bps INTEGER NOT NULL,
  target_amount DECIMAL(20,8) NOT NULL,
  source VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate locks table
CREATE TABLE rate_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES hedge_quotes(id),
  user_id VARCHAR(255) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  gmcr DECIMAL(20,8) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'locked',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hedges table
CREATE TABLE hedges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_id UUID REFERENCES rate_locks(id),
  amount DECIMAL(20,8) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  tenor INTEGER NOT NULL, -- hours
  strike DECIMAL(20,8) NOT NULL,
  expiry_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treasury transfers table
CREATE TABLE treasury_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_address VARCHAR(255) NOT NULL,
  to_address VARCHAR(255) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  reason VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  transaction_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_hedge_quotes_expires_at ON hedge_quotes(expires_at);
CREATE INDEX idx_rate_locks_user_id ON rate_locks(user_id);
CREATE INDEX idx_rate_locks_expires_at ON rate_locks(expires_at);
CREATE INDEX idx_hedges_status ON hedges(status);
CREATE INDEX idx_treasury_transfers_status ON treasury_transfers(status);
```

## 7. Security & Policies

### 7.1 Address Allow-lists
**File**: `auto-convert-api/src/middleware/address-allowlist.ts`

```typescript
export class AddressAllowlist {
  private static allowedAddresses = new Set<string>([
    // Treasury addresses
    process.env.TREASURY_ADDRESS,
    // Utila vault addresses
    ...(process.env.UTILA_VAULT_IDS?.split(',') || []),
    // Circle mint addresses
    process.env.CIRCLE_MINT_ADDRESS,
  ].filter(Boolean));

  static isAllowed(address: string): boolean {
    return this.allowedAddresses.has(address.toLowerCase());
  }

  static addAddress(address: string): void {
    this.allowedAddresses.add(address.toLowerCase());
  }

  static removeAddress(address: string): void {
    this.allowedAddresses.delete(address.toLowerCase());
  }
}
```

### 7.2 Per-Transaction Caps
**File**: `auto-convert-api/src/middleware/transaction-limits.ts`

```typescript
export interface TransactionLimits {
  maxAmount: number;
  maxDailyVolume: number;
  maxMonthlyVolume: number;
  currency: string;
}

export class TransactionLimitService {
  private static limits = new Map<string, TransactionLimits>([
    ['USD', { maxAmount: 10000, maxDailyVolume: 50000, maxMonthlyVolume: 500000, currency: 'USD' }],
    ['EUR', { maxAmount: 9000, maxDailyVolume: 45000, maxMonthlyVolume: 450000, currency: 'EUR' }],
    ['GHS', { maxAmount: 120000, maxDailyVolume: 600000, maxMonthlyVolume: 6000000, currency: 'GHS' }],
  ]);

  static validateTransaction(amount: number, currency: string, userId: string): boolean {
    const limit = this.limits.get(currency);
    if (!limit) return false;
    
    return amount <= limit.maxAmount;
  }

  static async validateDailyVolume(amount: number, currency: string, userId: string): Promise<boolean> {
    // Implementation would check against database
    return true; // Placeholder
  }
}
```

### 7.3 Approval Flows
**File**: `auto-convert-api/src/services/approval-service.ts`

```typescript
export interface ApprovalRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'hedge' | 'treasury_transfer' | 'large_transaction';
  status: 'pending' | 'approved' | 'rejected';
  approverId?: string;
  createdAt: string;
}

export class ApprovalService {
  static async requestApproval(request: Omit<ApprovalRequest, 'id' | 'status' | 'createdAt'>): Promise<string> {
    // Implementation would create approval request
    return 'approval_id';
  }

  static async approveRequest(approvalId: string, approverId: string): Promise<void> {
    // Implementation would approve request
  }

  static async rejectRequest(approvalId: string, approverId: string, reason: string): Promise<void> {
    // Implementation would reject request
  }
}
```

### 7.4 Peg Checks
**File**: `auto-convert-api/src/services/peg-monitor.ts`

```typescript
export class PegMonitor {
  private static readonly PEG_THRESHOLD = 0.01; // 1% deviation

  static async checkUSDPeg(): Promise<boolean> {
    const usdcPrice = await this.getUSDCPrice();
    const deviation = Math.abs(usdcPrice - 1.0);
    return deviation <= this.PEG_THRESHOLD;
  }

  static async checkEURPeg(): Promise<boolean> {
    const eurcPrice = await this.getEURCPrice();
    const eurPrice = await this.getEURPrice();
    const deviation = Math.abs(eurcPrice - eurPrice);
    return deviation <= this.PEG_THRESHOLD;
  }

  private static async getUSDCPrice(): Promise<number> {
    // Implementation would fetch from price oracle
    return 1.0; // Placeholder
  }

  private static async getEURCPrice(): Promise<number> {
    // Implementation would fetch from price oracle
    return 1.0; // Placeholder
  }

  private static async getEURPrice(): Promise<number> {
    // Implementation would fetch from price oracle
    return 1.0; // Placeholder
  }
}
```

### 7.5 Rate-Lock TTL Checks
**File**: `auto-convert-api/src/services/ttl-monitor.ts`

```typescript
export class TTLMonitor {
  static async checkExpiredLocks(): Promise<void> {
    // Implementation would find and expire old locks
    const expiredLocks = await this.getExpiredLocks();
    for (const lock of expiredLocks) {
      await this.expireLock(lock.id);
    }
  }

  static async getExpiredLocks(): Promise<RateLock[]> {
    // Implementation would query database for expired locks
    return []; // Placeholder
  }

  static async expireLock(lockId: string): Promise<void> {
    // Implementation would update lock status to expired
  }
}
```

### 7.6 Utila Integration Strategy
**File**: `auto-convert-api/src/services/treasury-factory.ts`

```typescript
export class TreasuryFactory {
  static createTreasuryClient(): TreasuryWalletClient {
    const provider = process.env.TREASURY_PROVIDER || 'local';
    
    switch (provider) {
      case 'utila':
        return new UtilaTreasuryClient();
      case 'fireblocks':
        return new FireblocksTreasuryClient();
      case 'local':
      default:
        return new LocalTreasuryClient();
    }
  }
}

// Seam for future Fireblocks integration
export class FireblocksTreasuryClient implements TreasuryWalletClient {
  // Implementation would integrate with Fireblocks API
  async transfer(request: TreasuryTransferRequest): Promise<TreasuryTransferResponse> {
    // Fireblocks-specific implementation
    throw new Error('Fireblocks integration not implemented');
  }
}
```

## 8. Tests & Telemetry

### 8.1 Unit Tests for GMCR Math
**File**: `auto-convert-api/src/tests/gmcr.test.ts`

```typescript
import { calculateGMCR } from '../services/gmcr-calculator';

describe('GMCR Calculator', () => {
  test('calculates GMCR correctly', () => {
    const baseRate = 1.08;
    const premium = 50; // 50 bps
    const spread = 40; // 40 bps
    
    const gmcr = calculateGMCR(baseRate, premium, spread);
    const expected = baseRate * (1 - (premium + spread) / 10000);
    
    expect(gmcr).toBeCloseTo(expected, 6);
  });

  test('handles edge cases', () => {
    expect(calculateGMCR(1.0, 0, 0)).toBe(1.0);
    expect(calculateGMCR(1.0, 100, 0)).toBe(0.99);
    expect(calculateGMCR(1.0, 0, 100)).toBe(0.99);
  });
});
```

### 8.2 TTL Expiry Behavior Tests
**File**: `auto-convert-api/src/tests/ttl.test.ts`

```typescript
import { TTLMonitor } from '../services/ttl-monitor';

describe('TTL Monitor', () => {
  test('expires locks after TTL', async () => {
    const lock = {
      id: 'test-lock',
      expiresAt: new Date(Date.now() - 1000).toISOString(),
      status: 'locked' as const
    };
    
    await TTLMonitor.expireLock(lock.id);
    
    // Verify lock is expired
    const updatedLock = await getLockById(lock.id);
    expect(updatedLock.status).toBe('expired');
  });

  test('re-quotes on expiry', async () => {
    const expiredQuote = await getExpiredQuote();
    const newQuote = await reQuote(expiredQuote.id);
    
    expect(newQuote.expiresAt).toBeGreaterThan(expiredQuote.expiresAt);
  });
});
```

### 8.3 Settlement Scenario Tests
**File**: `auto-convert-api/src/tests/settlement.test.ts`

```typescript
describe('Settlement Scenarios', () => {
  test('spot < GMCR triggers top-up', async () => {
    const hedge = { gmcr: 1.08, amount: 1000 };
    const spotRate = 1.05;
    
    const settlement = await settleHedge(hedge.id, spotRate);
    
    expect(settlement.type).toBe('top_up');
    expect(settlement.amount).toBe(30); // (1.08 - 1.05) * 1000
  });

  test('spot >= GMCR passes through', async () => {
    const hedge = { gmcr: 1.08, amount: 1000 };
    const spotRate = 1.10;
    
    const settlement = await settleHedge(hedge.id, spotRate);
    
    expect(settlement.type).toBe('pass_through');
    expect(settlement.amount).toBe(0);
  });
});
```

### 8.4 Observability
**File**: `auto-convert-api/src/middleware/telemetry.ts`

```typescript
import { createLogger } from 'pino';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.LOG_PRETTY === 'true' ? {
    target: 'pino-pretty'
  } : undefined
});

export class TelemetryService {
  static logQuoteLatency(startTime: number, quoteId: string): void {
    const latency = Date.now() - startTime;
    logger.info({
      metric: 'quote_latency_ms',
      quoteId,
      latency,
      timestamp: new Date().toISOString()
    });
  }

  static logHedgeFillTime(startTime: number, hedgeId: string): void {
    const fillTime = Date.now() - startTime;
    logger.info({
      metric: 'hedge_fill_time_ms',
      hedgeId,
      fillTime,
      timestamp: new Date().toISOString()
    });
  }

  static logTopUpAmount(amount: number, currency: string, hedgeId: string): void {
    logger.info({
      metric: 'top_up_amount',
      amount,
      currency,
      hedgeId,
      timestamp: new Date().toISOString()
    });
  }

  static logFailover(fromProvider: string, toProvider: string, reason: string): void {
    logger.warn({
      metric: 'provider_failover',
      fromProvider,
      toProvider,
      reason,
      timestamp: new Date().toISOString()
    });
  }
}
```

## 9. Open Questions

### 9.1 Technical Questions
1. **Database Choice**: Should we use PostgreSQL or consider a more specialized financial database?
2. **Message Queue**: Redis Streams vs RabbitMQ vs AWS SQS for background job processing?
3. **Caching Strategy**: Redis for distributed caching vs in-memory for simplicity?
4. **Monitoring**: Prometheus + Grafana vs DataDog vs New Relic for observability?

### 9.2 Business Questions
1. **Hedge Provider Selection**: 360T vs other NDF providers - what are the cost implications?
2. **Treasury Provider**: Utila vs Fireblocks vs other custody solutions - security vs cost trade-offs?
3. **FX Provider**: Nium vs existing Fixer.io - rate quality vs cost analysis?
4. **Settlement Frequency**: Real-time vs batch settlement for hedge positions?

### 9.3 Regulatory Questions
1. **Compliance**: What regulatory requirements exist for hedging operations in target markets?
2. **Reporting**: What transaction reporting is required for hedge positions?
3. **Capital Requirements**: What capital reserves are needed for hedge operations?
4. **Audit Trail**: What level of audit trail is required for regulatory compliance?

### 9.4 Operational Questions
1. **Risk Management**: What risk limits should be implemented for hedge positions?
2. **Liquidity Management**: How should we manage liquidity for hedge settlements?
3. **Disaster Recovery**: What backup systems are needed for hedge operations?
4. **Scaling**: How will the system scale as transaction volumes increase?

## 10. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up new branch `feature/auto-hedge-scaffold`
- [ ] Create adapter interfaces and stub implementations
- [ ] Add environment variables and configuration
- [ ] Set up basic database schema
- [ ] Implement GMCR calculation logic

### Phase 2: Core Integration (Weeks 3-4)
- [ ] Implement quote endpoints with GMCR
- [ ] Add rate locking functionality
- [ ] Create hedge booking system
- [ ] Implement treasury transfer operations
- [ ] Add basic security policies

### Phase 3: Testing & Observability (Weeks 5-6)
- [ ] Write comprehensive unit tests
- [ ] Add integration tests
- [ ] Implement telemetry and logging
- [ ] Set up monitoring dashboards
- [ ] Performance testing

### Phase 4: Production Readiness (Weeks 7-8)
- [ ] Security audit and penetration testing
- [ ] Load testing and optimization
- [ ] Documentation and runbooks
- [ ] Deployment automation
- [ ] Go-live preparation

## Conclusion

This integration plan provides a comprehensive roadmap for adding Auto-Hedge (GMCR) capabilities to the existing SendNReceive platform. The design maintains the current non-custodial user wallet architecture while adding sophisticated hedging capabilities for treasury operations.

The modular adapter pattern allows for easy swapping of providers (e.g., Utila → Fireblocks) without major refactoring, and the comprehensive testing strategy ensures reliability and compliance.

Key success factors:
1. **Maintain non-custodial user experience**
2. **Implement robust security policies**
3. **Ensure regulatory compliance**
4. **Plan for scalability and reliability**
5. **Maintain clear separation of concerns**

The implementation should proceed in phases, with thorough testing at each stage to ensure the system meets both technical and business requirements.
