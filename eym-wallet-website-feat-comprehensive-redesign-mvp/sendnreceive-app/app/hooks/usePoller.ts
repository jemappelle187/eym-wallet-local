import { useEffect, useState } from 'react';

export function useStatusPoller(fetchStatus: () => Promise<'PENDING'|'SUCCESSFUL'|'FAILED'>) {
  const [status, setStatus] = useState<'PENDING'|'SUCCESSFUL'|'FAILED'>('PENDING');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let mounted = true;
    let attempt = 0;
    const start = Date.now();

    const tick = async () => {
      if (!mounted) return;
      setElapsed(Math.floor((Date.now() - start) / 1000));
      try {
        const st = await fetchStatus();
        if (!mounted) return;
        if (st === 'SUCCESSFUL' || st === 'FAILED') {
          setStatus(st);
          return;
        }
      } catch (_) {
        // swallow and continue polling with backoff
      }
      attempt += 1;
      const backoff = Math.min(2500 + attempt * 250, 4000);
      setTimeout(tick, backoff);
    };

    tick();
    return () => { mounted = false; };
  }, [fetchStatus]);

  const showRescue = elapsed >= 45 && status === 'PENDING';
  return { status, elapsed, showRescue };
}

