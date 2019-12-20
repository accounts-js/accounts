type ValueOrPromise<T> = T | Promise<T>;

export interface TokenStorage {
  setItem(key: string, value: string): ValueOrPromise<void>;
  getItem(key: string): ValueOrPromise<string | null>;
  removeItem(key: string): ValueOrPromise<void>;
}
