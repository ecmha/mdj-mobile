import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  SESSION: 'user_id',
  THEME: 'theme',
  LANGUAGE: 'language',
  SHOW_WELCOME: 'show_welcome',
  DEVICE_TOKEN: 'device_token',
  HOME_TUTORIAL: 'home_tutorial',
} as const;

export const saveItem = (key: string, value: string) =>
  AsyncStorage.setItem(key, value);

export const retrieveItem = (key: string) =>
  AsyncStorage.getItem(key);

export const deleteItem = (key: string) =>
  AsyncStorage.removeItem(key);
