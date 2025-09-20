import { Router } from 'express';
import { z } from 'zod';
import { getBalance, getUserTransactions, getSystemTotals } from '../services/ledger';

export const usersRouter = Router();

// Validation schemas
const userIdSchema = z.object({ 
  userId: z.string().min(1, 'User ID is required') 
});

/**
 * GET /v1/users/:userId/balance
 * Get user's stablecoin balance
 */
usersRouter.get('/:userId/balance', (req, res) => {
  try {
    const { userId } = userIdSchema.parse(req.params);
    const balance = getBalance(userId);
    
    res.json({ 
      success: true, 
      userId, 
      balance,
      message: 'Balance retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get balance error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID',
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * GET /v1/users/:userId/transactions
 * Get user's transaction history
 */
usersRouter.get('/:userId/transactions', (req, res) => {
  try {
    const { userId } = userIdSchema.parse(req.params);
    const transactions = getUserTransactions(userId);
    
    res.json({ 
      success: true, 
      userId,
      transactions,
      count: transactions.length,
      message: 'Transaction history retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get transactions error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID',
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * GET /v1/users/system/totals
 * Get system-wide balance totals (admin endpoint)
 */
usersRouter.get('/system/totals', (req, res) => {
  try {
    const totals = getSystemTotals();
    
    res.json({ 
      success: true, 
      totals,
      message: 'System totals retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get system totals error:', error);
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * GET /v1/users/:userId/summary
 * Get user summary with balance and recent activity
 */
usersRouter.get('/:userId/summary', (req, res) => {
  try {
    const { userId } = userIdSchema.parse(req.params);
    
    const balance = getBalance(userId);
    const transactions = getUserTransactions(userId);
    const recentTransactions = transactions.slice(-10); // Last 10 transactions
    
    // Calculate total received
    const totalReceived = transactions
      .filter(tx => tx.type === 'credit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate total sent
    const totalSent = transactions
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const summary = {
      userId,
      balance,
      totalReceived,
      totalSent,
      recentTransactions,
      totalTransactions: transactions.length
    };
    
    res.json({ 
      success: true, 
      summary,
      message: 'User summary retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get user summary error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID',
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});












