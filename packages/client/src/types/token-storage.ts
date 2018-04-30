export interface TokenStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string>;
  removeItem(key: string): Promise<void>;
}
