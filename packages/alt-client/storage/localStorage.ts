import { StorageAdapter } from './interface';

const lS: StorageAdapter = {
  get: key => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  remove: key => localStorage.removeItem(key),
};

export default lS;
