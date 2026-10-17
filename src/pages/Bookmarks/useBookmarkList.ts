import { useCallback, useRef, useState } from 'react';
import { getBookmarks } from '@/services/bookmarks';
import { BookmarkSummary } from '@/services/bookmarks/types';
import { mergeBookmarkPages } from './mergeBookmarkPages';

// Divides cleanly by the grid's two columns, so the last visible row is never
// half empty while more pages remain.
const LIMIT = 12;

type LoadMode =
  // First paint, with the full-screen loader.
  | 'initial'
  // Another page appended at the bottom.
  | 'more'
  // Pull-to-refresh, with the RefreshControl spinner.
  | 'pull'
  // Coming back to the screen: rows update with no spinner at all.
  | 'silent';

export function useBookmarkList() {
  const [items, setItems] = useState<BookmarkSummary[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  // Drops responses from a request that a newer one has already replaced —
  // a refresh landing after the page-2 load would otherwise truncate the list.
  const requestIdRef = useRef(0);

  const load = useCallback(async (target: number, mode: LoadMode) => {
    const requestId = ++requestIdRef.current;
    if (mode === 'initial') setLoading(true);
    if (mode === 'more') setLoadingMore(true);
    if (mode === 'pull') setRefreshing(true);

    try {
      const result = await getBookmarks({ page: target, limit: LIMIT });
      if (requestId !== requestIdRef.current) return;
      setItems(current =>
        target === 1 ? result.data : mergeBookmarkPages(current, result.data),
      );
      setPage(result.page);
      setPages(result.pages);
      setTotal(result.total);
      setFailed(false);
    } catch {
      // A failed "load more" keeps the rows already on screen; only a failed
      // first page leaves nothing to show.
      if (requestId === requestIdRef.current && target === 1) setFailed(true);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    }
  }, []);

  const hasLoadedRef = useRef(false);

  // `load` handles its own failures and never rejects, so these three fire
  // it and let the state updates land on their own.
  /** Called on focus: a full load the first time, a quiet refresh after. */
  const reload = useCallback(() => {
    const mode: LoadMode = hasLoadedRef.current ? 'silent' : 'initial';
    hasLoadedRef.current = true;
    load(1, mode);
  }, [load]);

  const refresh = useCallback(() => {
    load(1, 'pull');
  }, [load]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || refreshing) return;
    if (page >= pages) return;
    load(page + 1, 'more');
  }, [loading, loadingMore, refreshing, page, pages, load]);

  return {
    items,
    total,
    loading,
    loadingMore,
    refreshing,
    failed,
    hasMore: page < pages,
    reload,
    refresh,
    loadMore,
  };
}
