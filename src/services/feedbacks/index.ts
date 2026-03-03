import { post, getHeaders } from '@/lib/fetch';
import { CreateFeedbackDto } from './types';

export const createFeedback = async (payload: CreateFeedbackDto) => {
  const headers = await getHeaders();
  return post('feedbacks', payload, headers);
};
