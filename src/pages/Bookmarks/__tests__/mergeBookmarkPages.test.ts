import { mergeBookmarkPages } from '../mergeBookmarkPages';
import { BookmarkSummary } from '@/services/bookmarks/types';

const row = (id: string): BookmarkSummary => ({
  id,
  message: { id: `m-${id}`, title: `Title ${id}`, author: null },
  createdAt: '2026-09-23T00:00:00.000Z',
  updatedAt: '2026-09-23T00:00:00.000Z',
});

describe('mergeBookmarkPages', () => {
  it('appends the next page in order', () => {
    const merged = mergeBookmarkPages([row('a'), row('b')], [row('c')]);
    expect(merged.map(b => b.id)).toEqual(['a', 'b', 'c']);
  });

  it('drops a row that shifted across the page boundary', () => {
    const merged = mergeBookmarkPages([row('a'), row('b')], [row('b'), row('c')]);
    expect(merged.map(b => b.id)).toEqual(['a', 'b', 'c']);
  });

  it('handles empty inputs', () => {
    expect(mergeBookmarkPages([], [row('a')]).map(b => b.id)).toEqual(['a']);
    expect(mergeBookmarkPages([row('a')], []).map(b => b.id)).toEqual(['a']);
  });
});
