import axios, { AxiosInstance } from 'axios';
import { ENV } from '../env';

type TokenResponse = {
  access_token: string;
  token_type: string; // usually "Bearer"
  expires_in: number; // seconds
};

export class MtnMomoCollectionsClient {
  private http: AxiosInstance;
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor(private opts?: { logger?: (msg: string, extra?: any) => void }) {
    this.http = axios.create({
      baseURL: ENV.MTN_MOMO_BASE_URL,
      timeout: 15000,
    });
  }

  private log(msg: string, extra?: any) {
    if (this.opts?.logger) this.opts.logger(msg, extra);
  }

  private requireConfig() {
    const missing: string[] = [];
    if (!ENV.MTN_MOMO_COLLECTIONS_SUBSCRIPTION_KEY) missing.push('MTN_MOMO_COLLECTIONS_SUBSCRIPTION_KEY');
    if (!ENV.MTN_MOMO_COLLECTIONS_API_USER) missing.push('MTN_MOMO_COLLECTIONS_API_USER');
    if (!ENV.MTN_MOMO_COLLECTIONS_API_KEY) missing.push('MTN_MOMO_COLLECTIONS_API_KEY');
    if (missing.length) {
      throw new Error(`Missing MTN MoMo configuration: ${missing.join(', ')}`);
    }
  }

  private isTokenValid() {
    return this.tokenCache && Date.now() < this.tokenCache.expiresAt - 10_000; // 10s skew
  }

  async getAccessToken(): Promise<string> {
    this.requireConfig();
    if (this.isTokenValid()) return this.tokenCache!.token;

    const basic = Buffer.from(
      `${ENV.MTN_MOMO_COLLECTIONS_API_USER}:${ENV.MTN_MOMO_COLLECTIONS_API_KEY}`,
      'utf8'
    ).toString('base64');

    const url = `/collection/token/`;
    this.log('Requesting MoMo token', { url, env: ENV.MTN_MOMO_ENV });
    const { data } = await this.http.post<TokenResponse>(url, undefined, {
      headers: {
        Authorization: `Basic ${basic}`,
        'Ocp-Apim-Subscription-Key': ENV.MTN_MOMO_COLLECTIONS_SUBSCRIPTION_KEY,
      },
    });

    const expiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    this.tokenCache = { token: data.access_token, expiresAt };
    return data.access_token;
  }

  private async authHeaders() {
    const token = await this.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': ENV.MTN_MOMO_COLLECTIONS_SUBSCRIPTION_KEY,
      'X-Target-Environment': ENV.MTN_MOMO_ENV,
      'Content-Type': 'application/json',
    } as const;
  }

  // Collections - RequestToPay
  async requestToPay(params: {
    referenceId: string; // UUID for idempotency and status lookup
    payerMsisdn: string; // e.g., '256774290781' (country code + number)
    amount: string; // '10.00'
    currency: string; // 'EUR' | 'USD' | 'GHS' etc per environment
    payerMessage?: string;
    payeeNote?: string;
    externalId?: string; // your internal reference
    payerPartyIdType?: 'MSISDN' | 'EMAIL' | 'PARTY_CODE';
  }): Promise<void> {
    const headers = await this.authHeaders();
    const url = `/collection/v1_0/requesttopay`;

    await this.http.post(
      url,
      {
        amount: params.amount,
        currency: params.currency,
        externalId: params.externalId ?? params.referenceId,
        payer: {
          partyIdType: params.payerPartyIdType ?? 'MSISDN',
          partyId: params.payerMsisdn,
        },
        payerMessage: params.payerMessage ?? 'Payment',
        payeeNote: params.payeeNote ?? 'Thanks',
      },
      {
        headers: { ...headers, 'X-Reference-Id': params.referenceId },
      }
    );
  }

  async getRequestToPayStatus(referenceId: string) {
    const headers = await this.authHeaders();
    const url = `/collection/v1_0/requesttopay/${referenceId}`;
    const { data } = await this.http.get(url, { headers });
    return data;
  }

  async getAccountBalance() {
    const headers = await this.authHeaders();
    const url = `/collection/v1_0/account/balance`;
    const { data } = await this.http.get(url, { headers });
    return data;
  }

  async getAccountholderActive(msisdn: string) {
    const headers = await this.authHeaders();
    const url = `/collection/v1_0/accountholder/MSISDN/${msisdn}/active`;
    const { data } = await this.http.get(url, { headers });
    return data;
  }
}

export const mtnMomoCollections = new MtnMomoCollectionsClient();
