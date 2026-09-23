import { API_URL } from '@env';
import { retrieveItem, STORAGE_KEYS } from '@/lib/storage';
import { readAccessToken } from '@/services/auth/session';
import type { SupportedLanguage } from '@/i18n';

export type CustomHeaders = {
  Authorization?: string;
  'x-mdj-device-token'?: string | null;
  'x-mdj-platform'?: string;
  'x-mdj-lang'?: string;
};

// Carries the status and the server's error `code` (e.g. `EMAIL_TAKEN`) so
// callers can tell failures apart without parsing the message.
export class HttpError extends Error {
  constructor(readonly status: number, readonly code?: string) {
    super(`HTTP error! status: ${status}`);
    this.name = 'HttpError';
  }
}

const buildHeaders = (custom: CustomHeaders = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  Object.entries(custom).forEach(([key, value]) => {
    if (value != null) headers[key] = value;
  });
  return headers;
};

const request = async (
  method: string,
  endpoint: string,
  options: RequestInit = {},
  headers: CustomHeaders = {},
): Promise<any> => {
  console.log(`Request: ${method} ${API_URL}/${endpoint}`);
  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    method,
    headers: buildHeaders(headers),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new HttpError(response.status, body?.code);
  }

  return response.json();
};

export const getHeaders = async (
  lang?: SupportedLanguage,
): Promise<CustomHeaders> => {
  const language = lang ?? (await retrieveItem(STORAGE_KEYS.LANGUAGE));
  // Read from storage rather than from AuthContext, so this helper stays
  // outside React — same as the device token above. `AuthProvider` is the only
  // writer of that key, so the two never drift. A guest has no token and
  // `buildHeaders` drops the header entirely; public routes ignore it anyway.
  const accessToken = readAccessToken(
    await retrieveItem(STORAGE_KEYS.AUTH_SESSION),
  );
  return {
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    'x-mdj-device-token': await retrieveItem(STORAGE_KEYS.DEVICE_TOKEN),
    'x-mdj-lang': language === 'en' ? 'en' : 'fr',
    'x-mdj-platform': 'mobile',
  };
};

export const get = (endpoint: string, headers?: CustomHeaders) =>
  request('GET', endpoint, {}, headers);

export const post = (
  endpoint: string,
  body: unknown,
  headers?: CustomHeaders,
) => request('POST', endpoint, { body: JSON.stringify(body) }, headers);

export const put = (endpoint: string, body: unknown, headers?: CustomHeaders) =>
  request('PUT', endpoint, { body: JSON.stringify(body) }, headers);

export const del = (endpoint: string, headers?: CustomHeaders) =>
  request('DELETE', endpoint, {}, headers);

export const download = async (endpoint: string): Promise<string> => {
  const response = await fetch(`${API_URL}/${endpoint}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
