import { post, getHeaders } from '@/lib/fetch';
import { saveItem, STORAGE_KEYS } from '@/lib/storage';
import { DeviceDto } from './types.d';

export const registerDevice = async (payload: DeviceDto) => {
  try {
    const headers = await getHeaders();
    const response = await post('devices', payload, headers);
    await saveItem(STORAGE_KEYS.DEVICE_TOKEN, response.deviceToken);
    return response;
  } catch (error) {
    console.info('Error registering device: ', error);
  }
};
