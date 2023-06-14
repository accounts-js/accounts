import { DatabaseInterface } from '@accounts/types';
import { Module } from 'graphql-modules';

export interface DatabaseTestInterface {
  databaseModule: Module;
  accountsDatabase: DatabaseInterface;

  start: () => Promise<void>;
  stop: () => Promise<void>;
}
