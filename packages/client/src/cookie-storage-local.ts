import { CookieStorage } from './types';

export const cookieStorageLocal: CookieStorage = {
  async setItem(key: string, value: string): Promise<void> {
    return localStorage.setItem(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  },

  async removeItem(key: string): Promise<void> {
    return localStorage.removeItem(key);
  },
};
