import { Router } from 'express';
import { z } from 'zod';
import { 
  convertDeposit, 
  getDeposit, 
  getFxByDeposit, 
  getMintForDeposit, 
  handleDepositWebhook,
  retryConversion,
  getUserDeposits,
  getUserConversionHistory,
  getSystemStats
} from '../services/deposits';

export const depositsRouter = Router();

// Validation schemas
const webhookSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  currency: z.enum(['USD', 'EUR', 'GHS', 'AED', 'NGN']),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['card', 'bank', 'mobile_money', 'paypal', 'apple_pay', 'google_pay']),
  paymentReference: z.string().optional(),
  description: z.string().optional(),
});

const convertSchema = z.object({ 
  id: z.string().min(1, 'Deposit ID is required') 
});

const userIdSchema = z.object({ 
  userId: z.string().min(1, 'User ID is required') 
});

/**
 * POST /v1/deposits/webhook
 * Handle deposit webhook from payment providers
 */
depositsRouter.post('/webhook', async (req, res) => {
  try {
    console.log('📥 Received deposit webhook:', req.body);
    
    const payload = webhookSchema.parse(req.body);
    const dep = await handleDepositWebhook(payload);
    
    res.status(201).json({ 
      success: true, 
      deposit: dep,
      message: 'Deposit processed successfully'
    });
  } catch (error: any) {
    console.error('❌ Deposit webhook error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request data',
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
 * POST /v1/deposits/:id/convert
 * Manually trigger conversion for a deposit
 */
depositsRouter.post('/:id/convert', async (req, res) => {
  try {
    const { id } = convertSchema.parse(req.params);
    const result = await convertDeposit(id);
    
    res.json({ 
      success: result.success, 
      ...result,
      message: result.success ? 'Conversion completed successfully' : 'Conversion failed'
    });
  } catch (error: any) {
    console.error('❌ Manual conversion error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid deposit ID',
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
 * POST /v1/deposits/:id/retry
 * Retry failed conversion
 */
depositsRouter.post('/:id/retry', async (req, res) => {
  try {
    const { id } = convertSchema.parse(req.params);
    const result = await retryConversion(id);
    
    res.json({ 
      success: result.success, 
      ...result,
      message: result.success ? 'Retry completed successfully' : 'Retry failed'
    });
  } catch (error: any) {
    console.error('❌ Retry conversion error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid deposit ID',
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
 * GET /v1/deposits/:id
 * Get deposit details with conversion status
 */
depositsRouter.get('/:id', (req, res) => {
  try {
    const { id } = convertSchema.parse(req.params);
    
    const dep = getDeposit(id);
    if (!dep) {
      return res.status(404).json({ 
        success: false, 
        error: 'Deposit not found' 
      });
    }
    
    const mint = getMintForDeposit(dep.id);
    const fx = getFxByDeposit(dep.id);
    
    res.json({ 
      success: true, 
      deposit: dep, 
      mint, 
      fx,
      message: 'Deposit details retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get deposit error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid deposit ID',
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
 * GET /v1/deposits/user/:userId
 * Get all deposits for a user
 */
depositsRouter.get('/user/:userId', (req, res) => {
  try {
    const { userId } = userIdSchema.parse(req.params);
    const deposits = getUserDeposits(userId);
    
    res.json({ 
      success: true, 
      deposits,
      count: deposits.length,
      message: 'User deposits retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get user deposits error:', error);
    
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
 * GET /v1/deposits/user/:userId/history
 * Get conversion history for a user
 */
depositsRouter.get('/user/:userId/history', (req, res) => {
  try {
    const { userId } = userIdSchema.parse(req.params);
    const history = getUserConversionHistory(userId);
    
    res.json({ 
      success: true, 
      history,
      count: history.length,
      message: 'Conversion history retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get conversion history error:', error);
    
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
 * GET /v1/deposits/stats/system
 * Get system statistics
 */
depositsRouter.get('/stats/system', (req, res) => {
  try {
    const stats = getSystemStats();
    
    res.json({ 
      success: true, 
      stats,
      message: 'System statistics retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get system stats error:', error);
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * GET /v1/deposits
 * Get all deposits (with pagination for production)
 */
depositsRouter.get('/', (req, res) => {
  try {
    // In production, add pagination, filtering, etc.
    const { store } = require('../services/deposits');
    const allDeposits = Array.from(store.deposits.values());
    
    res.json({ 
      success: true, 
      deposits: allDeposits,
      count: allDeposits.length,
      message: 'All deposits retrieved successfully'
    });
  } catch (error: any) {
    console.error('❌ Get all deposits error:', error);
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});












