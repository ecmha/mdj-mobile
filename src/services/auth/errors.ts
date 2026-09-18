import { HttpError } from '@/lib/fetch';

// Maps a failed auth request to the message shown to the user.
export const authErrorKey = (error: unknown) => {
  if (!(error instanceof HttpError)) return 'auth.errors.generic' as const;
  if (error.code === 'EMAIL_TAKEN') return 'auth.errors.email_taken' as const;
  if (error.code === 'USER_PENDING') {
    return 'auth.errors.account_pending' as const;
  }
  if (error.status === 401) return 'auth.errors.invalid_credentials' as const;
  if (error.status === 429) return 'auth.errors.too_many_attempts' as const;
  return 'auth.errors.generic' as const;
};
