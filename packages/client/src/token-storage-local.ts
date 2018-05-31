import { TokenStorage } from './types';

export const tokenStorageLocal: TokenStorage = {
  async setItem(key: string, value: string) {
    return localStorage.setItem(key, value);
  },

  async getItem(key: string) {
    return localStorage.getItem(key);
  },

  async removeItem(key: string) {
    return localStorage.removeItem(key);
  },
};
