import { Router } from 'express';
import { fxPartner } from '../services/fx';

export const fxRouter = Router();

// GET /v1/fx/quote?from=GHS&to=USD&amount=100
fxRouter.get('/quote', async (req, res) => {
  try {
    const from = String(req.query.from || '').toUpperCase();
    const to = String(req.query.to || '').toUpperCase();
    const amount = Number(req.query.amount || 0);
    if (!from || !to || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' });
    }
    const quote = await fxPartner.convertCurrency(from as any, to as any, amount);
    return res.json({ success: true, data: quote });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message || 'FX quote failed' });
  }
});

