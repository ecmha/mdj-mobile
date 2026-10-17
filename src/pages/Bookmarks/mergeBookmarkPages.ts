import { BookmarkSummary } from '@/services/bookmarks/types';

/**
 * Appends a freshly loaded page to the rows already on screen, keeping the
 * first copy of each bookmark.
 *
 * Rows come back newest first, so saving a message while the list is open
 * pushes every row one place down and the same bookmark can arrive on two
 * pages. Concatenating blindly would render it twice and hand `keyExtractor`
 * a duplicate key.
 */
export const mergeBookmarkPages = (
  current: BookmarkSummary[],
  next: BookmarkSummary[],
): BookmarkSummary[] => {
  const seen = new Set(current.map(bookmark => bookmark.id));
  return [...current, ...next.filter(bookmark => !seen.has(bookmark.id))];
};
