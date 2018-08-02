import { DatabaseInterface } from '@accounts/types';

export interface DatabaseTestInterface {
  accountsDatabase: DatabaseInterface;

  start: () => Promise<void>;
  stop: () => Promise<void>;
}
