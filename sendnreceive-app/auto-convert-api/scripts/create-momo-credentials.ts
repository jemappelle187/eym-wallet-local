import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const SUB_KEY = process.env.MTN_MOMO_COLLECTIONS_SUBSCRIPTION_KEY;
const BASE = process.env.MTN_MOMO_BASE_URL || 'https://sandbox.momodeveloper.mtn.com';
const CALLBACK = process.env.MTN_MOMO_CALLBACK_HOST || 'https://example.com';

if (!SUB_KEY) {
  console.error('Missing MTN_MOMO_COLLECTIONS_SUBSCRIPTION_KEY in env');
  process.exit(1);
}

async function main() {
  const referenceId = uuidv4();
  const http = axios.create({ baseURL: BASE, timeout: 15000 });

  console.log('Creating API User with referenceId:', referenceId);
  await http.post(
    '/v1_0/apiuser',
    { providerCallbackHost: CALLBACK },
    {
      headers: {
        'X-Reference-Id': referenceId,
        'Ocp-Apim-Subscription-Key': SUB_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('Generating API Key for user:', referenceId);
  const { data } = await http.post(
    `/v1_0/apiuser/${referenceId}/apikey`,
    undefined,
    { headers: { 'Ocp-Apim-Subscription-Key': SUB_KEY } }
  );

  console.log('Success! Save these values to your .env:');
  console.log('MTN_MOMO_COLLECTIONS_API_USER=', referenceId);
  console.log('MTN_MOMO_COLLECTIONS_API_KEY=', data.apiKey);
}

main().catch((err) => {
  if (axios.isAxiosError(err)) {
    console.error('HTTP Error', err.response?.status, err.response?.data || err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
});
