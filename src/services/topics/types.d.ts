/** A topic as `GET /topics` sends it: both languages at once, whatever
 * `x-mdj-lang` says, so the list doesn't need a refetch on language change. */
export interface Topic {
  _id: string;
  name: { fr: string; en: string };
  /** GridFS file id, served by `GET /files/:id/view`. */
  cover?: string;
  createdAt: string;
  updatedAt: string;
}
