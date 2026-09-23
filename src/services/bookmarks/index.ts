import { get, post, del, getHeaders } from '@/lib/fetch';
import {
  Bookmark,
  BookmarkSummary,
  FindBookmarksQuery,
  PaginatedBookmarks,
} from './types';

// Built by hand: React Native's URL polyfill has no `searchParams`.
const toQueryString = (params: Record<string, string | number | undefined>) => {
  const pairs = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(String(value))}`,
    );
  return pairs.length > 0 ? `?${pairs.join('&')}` : '';
};

/**
 * Saves a message for the signed-in reader. Idempotent server-side: saving
 * one twice returns the existing bookmark instead of failing.
 */
export const addBookmark = async (messageId: string): Promise<Bookmark> => {
  const headers = await getHeaders();
  return post('bookmarks', { message: messageId }, headers);
};

/** The reader's own bookmarks, newest first. Each row carries the message's
 * title and cover only. */
export const getBookmarks = async (
  query: FindBookmarksQuery = {},
): Promise<PaginatedBookmarks> => {
  const headers = await getHeaders();
  return get(`bookmarks${toQueryString({ ...query })}`, headers);
};

/** One bookmark with its whole message — what the message page renders. */
export const getBookmark = async (id: string): Promise<Bookmark> => {
  const headers = await getHeaders();
  return get(`bookmarks/${id}`, headers);
};

/** Whether this message is already bookmarked, and under which id. */
export const findBookmarkForMessage = async (
  messageId: string,
): Promise<BookmarkSummary | null> => {
  const headers = await getHeaders();
  const page: PaginatedBookmarks = await get(
    `bookmarks${toQueryString({ messageId, limit: 1 })}`,
    headers,
  );
  return page.data[0] ?? null;
};

/** Unsaving happens from the bookmarks list, not from Home. */
export const removeBookmark = async (
  id: string,
): Promise<{ id: string; deleted: boolean }> => {
  const headers = await getHeaders();
  return del(`bookmarks/${id}`, headers);
};
