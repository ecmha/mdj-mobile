import { useContext } from 'react';
import { BookmarksContext } from '@/contexts/bookmarksProvider';

export const useBookmarks = () => useContext(BookmarksContext);
