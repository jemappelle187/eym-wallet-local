import { Router } from 'express';
import axios from 'axios';
import { ENV } from '../env';
import { getCircleSimulateMode, setCircleSimulateMode } from '../services/circle';

export const debugRouter = Router();

debugRouter.get('/circle', async (req, res) => {
  const simulate = getCircleSimulateMode();
  const baseUrlResolved = simulate
    ? 'simulate://circle' // indicates no network call
    : (ENV.CIRCLE_BASE_URL || 'https://api.circle.com/v1');

  const key = ENV.CIRCLE_API_KEY || '';
  const apiKeyPresent = Boolean(key);
  const apiKeyPreview = key ? `${key.slice(0, 6)}...${key.slice(-4)}` : '';

  const runHealth = req.query.health === '1' && !simulate;

  const out: any = {
    success: true,
    simulate, // true = our service will simulate minting
    baseUrlResolved,
    apiKeyPresent,
    apiKeyPreview,
    note: simulate
      ? 'CIRCLE_SANDBOX=true → backend simulates Circle mints (no network call).'
      : 'CIRCLE_SANDBOX=false → backend will call Circle using the resolved base URL.'
  };

  if (runHealth) {
    try {
      const resp = await axios.get(`${baseUrlResolved}/health`, {
        headers: { Authorization: `Bearer ${key}` },
        timeout: 5000,
      });
      out.health = { attempted: true, ok: true, status: resp.status };
    } catch (e: any) {
      out.health = {
        attempted: true,
        ok: false,
        status: e?.response?.status || 0,
        error: e?.response?.data || e?.message || 'request_failed',
      };
    }
  }

  res.json(out);
});

// Toggle runtime simulation without restart
debugRouter.post('/circle/toggle', (req, res) => {
  const q = String((req.query.simulate ?? '')).toLowerCase();
  if (q !== '1' && q !== '0' && q !== 'true' && q !== 'false') {
    return res.status(400).json({ success: false, error: 'Provide ?simulate=1|0' });
  }
  const v = q === '1' || q === 'true';
  setCircleSimulateMode(v);
  return res.json({ success: true, simulate: getCircleSimulateMode() });
});

// Masked keys info
debugRouter.get('/circle/keys', (req, res) => {
  const mask = (s?: string) => s ? `${s.slice(0, 6)}...${s.slice(-4)}` : '';
  res.json({
    success: true,
    simulate: getCircleSimulateMode(),
    keys: {
      CIRCLE_API_KEY: { present: !!ENV.CIRCLE_API_KEY, preview: mask(ENV.CIRCLE_API_KEY) },
      CIRCLE_TREASURY_USDC_ADDRESS: { present: !!ENV.CIRCLE_TREASURY_USDC_ADDRESS, preview: mask(ENV.CIRCLE_TREASURY_USDC_ADDRESS) },
      CIRCLE_TREASURY_EURC_ADDRESS: { present: !!ENV.CIRCLE_TREASURY_EURC_ADDRESS, preview: mask(ENV.CIRCLE_TREASURY_EURC_ADDRESS) },
    }
  });
});
