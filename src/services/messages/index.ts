import { get, post, put, del, getHeaders } from '@/lib/fetch';
import { CreateMessageDto, Message, UpdateMessageDto } from './types.d';

export const getDayMessages = async (): Promise<Message[]> => {
  const headers = await getHeaders();
  return get('messages/currents', headers);
};

export const getMessages = async (): Promise<Message[]> => {
  const headers = await getHeaders();
  return get('messages', headers);
};

export const getMessage = async (id: string): Promise<Message> => {
  const headers = await getHeaders();
  return get(`messages/${id}`, headers);
};

export const createMessage = async (
  payload: CreateMessageDto,
): Promise<Message> => {
  const headers = await getHeaders();
  return post('messages', payload, headers);
};

export const updateMessage = async (
  id: string,
  payload: UpdateMessageDto,
): Promise<Message> => {
  const headers = await getHeaders();
  return put(`messages/${id}`, payload, headers);
};

export const deleteMessage = async (id: string): Promise<void> => {
  const headers = await getHeaders();
  return del(`messages/${id}`, headers);
};
