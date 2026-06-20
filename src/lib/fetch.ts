import { API_URL } from '@env';
import { retrieveItem, STORAGE_KEYS } from '@/lib/storage';

export type CustomHeaders = {
  'x-mdj-device-token'?: string | null;
  'x-mdj-platform'?: string;
};

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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getHeaders = async (): Promise<CustomHeaders> => ({
  'x-mdj-device-token': await retrieveItem(STORAGE_KEYS.DEVICE_TOKEN),
});

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
