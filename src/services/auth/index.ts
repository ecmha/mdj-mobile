import { OneSignal } from 'react-native-onesignal';
import { post, getHeaders } from '@/lib/fetch';
import { AuthResponse, Credentials, SignupForm } from './types';

// The server links the account to this device's OneSignal id (the id the
// device was registered with on the Welcome page), so pushes can target it.
const getOnesignalId = async () => {
  try {
    return (await OneSignal.User.getOnesignalId()) ?? undefined;
  } catch {
    return undefined;
  }
};

export const login = async (
  credentials: Credentials,
): Promise<AuthResponse> => {
  const headers = await getHeaders();
  const onesignalId = await getOnesignalId();
  return post('auth/login', { ...credentials, onesignalId }, headers);
};

export const signup = async (form: SignupForm): Promise<AuthResponse> => {
  const headers = await getHeaders();
  const onesignalId = await getOnesignalId();
  return post('auth/signup', { ...form, role: 'user', onesignalId }, headers);
};

export const requestPasswordReset = async (email: string) => {
  const headers = await getHeaders();
  return post('auth/forgot-password', { email }, headers);
};

// Throws HttpError with code RESET_TOKEN_INVALID for an unknown, used or
// expired token.
export const resetPassword = async (token: string, password: string) => {
  const headers = await getHeaders();
  return post('auth/reset-password', { token, password }, headers);
};
