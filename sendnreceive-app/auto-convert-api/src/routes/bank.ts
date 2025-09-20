import { Router } from 'express';

// In-memory mock store: referenceId -> createdAt
const startedAt = new Map<string, number>();

export const bankRouter = Router();

// Optional helper to initiate a mock transfer and get a referenceId
bankRouter.post('/mock/initiate', (req, res) => {
  const ref = req.body?.referenceId || `bank_${Date.now()}`;
  startedAt.set(ref, Date.now());
  return res.status(201).json({ success: true, referenceId: ref });
});

// Poll status: returns PENDING for ~8s, then SUCCESSFUL
bankRouter.get('/status/:id', (req, res) => {
  const { id } = req.params;
  const now = Date.now();
  const t0 = startedAt.get(id) ?? (now - 9000); // assume started 9s ago if unknown
  const elapsed = now - t0;
  const status = elapsed < 8000 ? 'PENDING' : 'SUCCESSFUL';
  return res.json({ success: true, data: { status, elapsedMs: elapsed } });
});

