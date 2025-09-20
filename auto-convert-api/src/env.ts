import 'dotenv/config';

export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  // Circle API Configuration
  CIRCLE_API_KEY: required('CIRCLE_API_KEY'),
  CIRCLE_BASE_URL: process.env.CIRCLE_BASE_URL ?? 'https://api.circle.com/v1',
  CIRCLE_SANDBOX: (process.env.CIRCLE_SANDBOX ?? 'true') === 'true',

  // FX Partner Configuration
  FX_PARTNER_BASE_URL: process.env.FX_PARTNER_BASE_URL ?? '',
  FX_API_KEY: process.env.FX_API_KEY ?? '',

  // Ledger Configuration
  LEDGER_BASE_CURRENCY: process.env.LEDGER_BASE_CURRENCY ?? 'USD',

  // Security
  JWT_SECRET: process.env.JWT_SECRET ?? 'default-jwt-secret-change-in-production',
  API_KEY_SECRET: process.env.API_KEY_SECRET ?? 'default-api-key-secret-change-in-production',

  // Database (for future implementation)
  DATABASE_URL: process.env.DATABASE_URL ?? '',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000),
  RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100),
};

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required environment variable: ${key}`);
  return v;
}












