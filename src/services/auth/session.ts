/** The session `AuthProvider` persists under `STORAGE_KEYS.AUTH_SESSION`. */
type StoredSession = {
  accessToken?: string;
};

/**
 * Reads the bearer token out of the persisted session.
 *
 * Deliberately defensive and dependency-free: the value comes back from
 * AsyncStorage, where it can be absent (guest), corrupted, or left over from
 * an older session shape — none of which should throw inside a request.
 */
export const readAccessToken = (stored: string | null): string | null => {
  if (!stored) return null;
  try {
    const session = JSON.parse(stored) as StoredSession | null;
    const token = session?.accessToken;
    return typeof token === 'string' && token.length > 0 ? token : null;
  } catch {
    return null;
  }
};
