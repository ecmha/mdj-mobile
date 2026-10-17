import { Message } from '@/services/messages/types';

/** The message as a list row carries it: the server projects it down to
 * these fields, and sends the whole message only on the single-bookmark
 * routes. `null` when the message was deleted after it was bookmarked. */
export interface BookmarkAuthor {
  id: string;
  firstname: string;
  lastname?: string;
}

export interface BookmarkMessageSummary {
  id: string;
  title: string;
  cover?: string;
  author: BookmarkAuthor | null;
}

export interface Bookmark {
  id: string;
  message: Message | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkSummary {
  id: string;
  message: BookmarkMessageSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBookmarks {
  data: BookmarkSummary[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface FindBookmarksQuery {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
}
