import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageType = typeof AsyncStorage;

export default class Storage {
  static SESSION_KEY = "user_id";
  static THEME_KEY = "theme";
  static LANGUAGE_KEY = "language";
  static SECURE_STORAGE = null;
  static ASYNC_STORAGE = AsyncStorage;

  static async save(key: string, value: string, storage: StorageType = AsyncStorage) {
    try {
      await storage.setItem(key, value);
    } catch (error) {
      throw new Error(`Failed to setItemAsync: ${error}`);
    }
  }

  static async retrieve(key: string, storage: StorageType = AsyncStorage) {
    try {
      const data = await storage.getItem(key);
      return data;
    } catch (error) {
      throw new Error(`Failed to getItemAsync: ${error}`);
    }
  }

  static async delete(key: string, storage: StorageType = AsyncStorage) {
    try {
      await storage.removeItem(key);
    } catch (error) {
      throw new Error(`Failed to delete: ${error}`);
    }
  }
}