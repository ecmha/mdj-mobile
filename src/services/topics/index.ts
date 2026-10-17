import { get, getHeaders } from '@/lib/fetch';
import { Topic } from './types';

/** Every topic, sorted by French name. Public, and not paginated. */
export const getTopics = async (): Promise<Topic[]> => {
  const headers = await getHeaders();
  return get('topics', headers);
};
