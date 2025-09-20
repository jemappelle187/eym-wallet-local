import { randomUUID } from 'crypto';

// In-memory idempotency store (replace with Redis in production)
const processedKeys = new Set<string>();

/**
 * Ensures a key is only processed once
 * @param key - Unique identifier for the operation
 * @returns true if this is the first time processing this key, false if already processed
 */
export function once(key: string): boolean {
  if (processedKeys.has(key)) {
    return false;
  }
  processedKeys.add(key);
  return true;
}

/**
 * Generates a unique idempotency key for Circle API calls
 * @param depositId - The deposit ID
 * @param operation - The operation type (e.g., 'mint_usdc', 'mint_eurc')
 * @returns A unique idempotency key
 */
export function generateIdempotencyKey(depositId: string, operation: string): string {
  return `${operation}_${depositId}_${Date.now()}`;
}

/**
 * Generates a unique deposit ID if not provided
 * @param existingId - Optional existing ID
 * @returns A unique deposit ID
 */
export function generateDepositId(existingId?: string): string {
  return existingId || `dep_${randomUUID()}`;
}

/**
 * Cleans up old idempotency keys (call periodically in production)
 * In production, use Redis with TTL instead of this in-memory approach
 */
export function cleanupOldKeys(): void {
  // This is a simplified cleanup - in production, use Redis with TTL
  if (processedKeys.size > 10000) {
    processedKeys.clear();
  }
}

/**
 * Checks if an operation has already been processed
 * @param key - The idempotency key to check
 * @returns true if already processed, false otherwise
 */
export function isProcessed(key: string): boolean {
  return processedKeys.has(key);
}












