import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  deleteItem,
  retrieveItem,
  saveItem,
  STORAGE_KEYS,
} from '@/lib/storage';
import * as authService from '@/services/auth';
import {
  AuthResponse,
  AuthUser,
  Credentials,
  SignupForm,
} from '@/services/auth/types';

interface ProviderProps {
  children: React.ReactNode;
}

type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

export type AuthContextProps = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  // Resolves to false when the account was created but no session was opened.
  signup: (form: SignupForm) => Promise<boolean>;
  logout: () => void;
  // Runs `action` for a signed-in user, otherwise opens the sign-in prompt,
  // which stays open until a session opens or the user dismisses it.
  requireAuth: (action: () => void) => void;
  promptVisible: boolean;
  // Opens the prompt without an action to run: for a session that turns out
  // to be dead mid-request (a 401), where `requireAuth` would still see the
  // stale session and run the action instead of asking to sign in.
  openPrompt: () => void;
  closePrompt: () => void;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => false,
  logout: () => {},
  requireAuth: () => {},
  promptVisible: false,
  openPrompt: () => {},
  closePrompt: () => {},
});

export const AuthProvider = ({ children }: ProviderProps) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [promptVisible, setPromptVisible] = useState(false);

  useEffect(() => {
    retrieveItem(STORAGE_KEYS.AUTH_SESSION)
      .then(stored => {
        if (stored) setSession(JSON.parse(stored));
      })
      .catch(() => {});
  }, []);

  const openSession = useCallback((response: AuthResponse) => {
    if (!response.access_token) return false;
    const next: AuthSession = {
      user: response.user,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
    setSession(next);
    setPromptVisible(false);
    saveItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(next));
    return true;
  }, []);

  const login = useCallback(
    async (credentials: Credentials) => {
      openSession(await authService.login(credentials));
    },
    [openSession],
  );

  const signup = useCallback(
    async (form: SignupForm) => openSession(await authService.signup(form)),
    [openSession],
  );

  const logout = useCallback(() => {
    setSession(null);
    deleteItem(STORAGE_KEYS.AUTH_SESSION);
  }, []);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (session) action();
      else setPromptVisible(true);
    },
    [session],
  );

  const openPrompt = useCallback(() => setPromptVisible(true), []);

  const closePrompt = useCallback(() => setPromptVisible(false), []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: session !== null,
      login,
      signup,
      logout,
      requireAuth,
      promptVisible,
      openPrompt,
      closePrompt,
    }),
    [
      session,
      login,
      signup,
      logout,
      requireAuth,
      promptVisible,
      openPrompt,
      closePrompt,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
