import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mtnMomoCollections } from '../services/mtn-momo';
import { ENV } from '../env';

export const momoRouter = Router();

function normalizeMsisdn(input: string): string {
  // Keep digits only; drop leading 00 if present; never auto-prepend country codes
  const digits = String(input).replace(/\D/g, '');
  return digits.replace(/^00/, '');
}

function toAmount2dp(value: any): string {
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  if (!Number.isFinite(n)) throw new Error('Invalid amount');
  return n.toFixed(2);
}

// Simple health to verify token retrieval
momoRouter.get('/health', async (req, res) => {
  try {
    await mtnMomoCollections.getAccessToken();
    res.json({ success: true, message: 'MoMo auth OK' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.response?.data || e.message });
  }
});

// POST /v1/momo/request-to-pay
momoRouter.post('/request-to-pay', async (req, res, next) => {
  try {
    const { payerMsisdn, amount, currency, payerMessage, payeeNote, externalId } = req.body || {};
    if (!payerMsisdn || !amount || !currency) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: payerMsisdn, amount, currency',
      });
    }

    const referenceId = uuidv4();
    const msisdn = normalizeMsisdn(payerMsisdn);
    let normalizedAmount: string;
    try {
      normalizedAmount = toAmount2dp(amount);
    } catch (e: any) {
      return res.status(400).json({ success: false, error: 'Invalid amount format' });
    }
    const curr = String(currency).toUpperCase();
    if (curr !== ENV.MTN_MOMO_CURRENCY) {
      return res.status(400).json({
        success: false,
        error: `Invalid currency for this market. Expected ${ENV.MTN_MOMO_CURRENCY}.`,
      });
    }
    await mtnMomoCollections.requestToPay({
      referenceId,
      payerMsisdn: msisdn,
      amount: normalizedAmount,
      currency: curr,
      payerMessage,
      payeeNote,
      externalId,
    });

    res.status(202).json({ success: true, referenceId, status: 'PENDING' });
  } catch (err) {
    const anyErr: any = err;
    const status = anyErr?.response?.status || 500;
    const data = anyErr?.response?.data || { message: anyErr?.message || 'Request failed' };
    return res.status(status).json({ success: false, error: data });
  }
});

// GET /v1/momo/status/:id
momoRouter.get('/status/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await mtnMomoCollections.getRequestToPayStatus(id);
    res.json({ success: true, referenceId: id, data });
  } catch (err) {
    const anyErr: any = err;
    const status = anyErr?.response?.status || 500;
    const data = anyErr?.response?.data || { message: anyErr?.message || 'Request failed' };
    return res.status(status).json({ success: false, error: data });
  }
});

// GET /v1/momo/balance
momoRouter.get('/balance', async (req, res, next) => {
  try {
    const data = await mtnMomoCollections.getAccountBalance();
    res.json({ success: true, data });
  } catch (err) {
    const anyErr: any = err;
    const status = anyErr?.response?.status || 500;
    const data = anyErr?.response?.data || { message: anyErr?.message || 'Request failed' };
    return res.status(status).json({ success: false, error: data });
  }
});

// GET /v1/momo/accountholder/:msisdn/active
momoRouter.get('/accountholder/:msisdn/active', async (req, res) => {
  try {
    const msisdn = normalizeMsisdn(req.params.msisdn);
    const data = await mtnMomoCollections.getAccountholderActive(msisdn);
    res.json({ success: true, msisdn, data });
  } catch (anyErr: any) {
    const status = anyErr?.response?.status || 500;
    const data = anyErr?.response?.data || { message: anyErr?.message || 'Request failed' };
    return res.status(status).json({ success: false, error: data });
  }
});
