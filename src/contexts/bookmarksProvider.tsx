import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { HttpError } from '@/lib/fetch';
import * as bookmarksService from '@/services/bookmarks';
import { useAuth } from '@/hooks/useAuth';

interface ProviderProps {
  children: React.ReactNode;
}

/** What `save()` tells its caller, so the UI knows which feedback to show.
 * `signed-out` needs none: the sign-in prompt is already up. */
export type SaveResult = 'saved' | 'failed' | 'signed-out';

/** messageId → bookmark id, or `null` for "checked, not bookmarked".
 * A missing entry means "not checked yet". */
type Statuses = Record<string, string | null>;

export type BookmarksContextProps = {
  isBookmarked: (messageId: string) => boolean;
  isSaving: (messageId: string) => boolean;
  // Add only. Removing a bookmark belongs to the bookmarks list, not Home.
  save: (messageId: string) => Promise<SaveResult>;
  // Looks the message up once, lazily, and caches the answer.
  ensureStatus: (messageId: string) => void;
  // Write-back seam: the bookmarks list calls this after deleting one, so
  // Home's icon stops showing it as saved without waiting for a restart.
  setStatus: (messageId: string, bookmarkId: string | null) => void;
};

export const BookmarksContext = createContext<BookmarksContextProps>({
  isBookmarked: () => false,
  isSaving: () => false,
  save: async () => 'failed',
  ensureStatus: () => {},
  setStatus: () => {},
});

export const BookmarksProvider = ({ children }: ProviderProps) => {
  const { user, isAuthenticated, logout, openPrompt } = useAuth();
  const [statuses, setStatuses] = useState<Statuses>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  // Messages whose lookup has been started, so a re-render or a swipe back
  // doesn't ask the server again.
  const lookedUpRef = useRef<Set<string>>(new Set());

  // A cache belongs to one account. Without this, signing out and back in as
  // someone else would leave the previous reader's bookmarks on screen.
  useEffect(() => {
    setStatuses({});
    setSaving({});
    lookedUpRef.current = new Set();
  }, [user?._id]);

  // The 7-day access token can expire between sessions, and there is no
  // refresh flow, so a 401 means the session is over: drop it and let the
  // caller decide whether to ask for a new one.
  const handleExpiredSession = useCallback(
    (error: unknown) => {
      if (error instanceof HttpError && error.status === 401) {
        logout();
        return true;
      }
      return false;
    },
    [logout],
  );

  const setStatus = useCallback(
    (messageId: string, bookmarkId: string | null) => {
      lookedUpRef.current.add(messageId);
      setStatuses(current => ({ ...current, [messageId]: bookmarkId }));
    },
    [],
  );

  const ensureStatus = useCallback(
    (messageId: string) => {
      // Guests have no bookmarks to look up, and the route would 401.
      if (!isAuthenticated) return;
      if (lookedUpRef.current.has(messageId)) return;
      lookedUpRef.current.add(messageId);

      bookmarksService
        .findBookmarkForMessage(messageId)
        .then(bookmark =>
          setStatuses(current => ({
            ...current,
            [messageId]: bookmark?.id ?? null,
          })),
        )
        .catch(error => {
          // Let a later render retry: a lookup that failed on a flaky network
          // must not pin the icon to "not bookmarked" for the whole session.
          lookedUpRef.current.delete(messageId);
          // Silent on purpose — this runs on render, not on a tap. The reader
          // finds out when they act, and the tap then opens the prompt.
          handleExpiredSession(error);
        });
    },
    [isAuthenticated, handleExpiredSession],
  );

  const save = useCallback(
    async (messageId: string): Promise<SaveResult> => {
      if (statuses[messageId] || saving[messageId]) return 'saved';

      // Optimistic: `isBookmarked` counts an in-flight save, so the icon
      // fills on the tap rather than a round trip later.
      setSaving(current => ({ ...current, [messageId]: true }));
      try {
        const bookmark = await bookmarksService.addBookmark(messageId);
        setStatus(messageId, bookmark.id);
        return 'saved';
      } catch (error) {
        // Back to "checked, not bookmarked" — the icon empties again.
        setStatus(messageId, null);
        if (handleExpiredSession(error)) {
          openPrompt();
          return 'signed-out';
        }
        return 'failed';
      } finally {
        setSaving(current => ({ ...current, [messageId]: false }));
      }
    },
    [statuses, saving, setStatus, handleExpiredSession, openPrompt],
  );

  const isBookmarked = useCallback(
    (messageId: string) =>
      Boolean(statuses[messageId]) || Boolean(saving[messageId]),
    [statuses, saving],
  );

  const isSaving = useCallback(
    (messageId: string) => Boolean(saving[messageId]),
    [saving],
  );

  const value = useMemo(
    () => ({ isBookmarked, isSaving, save, ensureStatus, setStatus }),
    [isBookmarked, isSaving, save, ensureStatus, setStatus],
  );

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};
