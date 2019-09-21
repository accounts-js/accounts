import { TokenStorage } from './types';

export const tokenStorageLocal: TokenStorage = {
  setItem(key: string, value: string): void {
    return localStorage.setItem(key, value);
  },

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  },

  removeItem(key: string): void {
    return localStorage.removeItem(key);
  },
};
