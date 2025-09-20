import 'dotenv/config';
import { MtnMomoCollectionsClient } from '../src/services/mtn-momo';

async function main() {
  const client = new MtnMomoCollectionsClient({
    logger: (m) => console.log('[momo]', m),
  });
  const token = await client.getAccessToken();
  console.log('Access token obtained (length):', token.length);
}

main().catch((e) => {
  console.error('Failed to get token:', e.response?.data || e.message);
  process.exit(1);
});

