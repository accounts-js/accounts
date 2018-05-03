import * as Ioredis from 'ioredis';
import {
  CreateUser,
  User,
  Session,
  DatabaseInterface,
  ConnectionInformations,
} from '@accounts/types';
import { AccountsRedisOptions } from './types';

const defaultOptions = {};

export class Redis implements DatabaseInterface {
  private options: AccountsRedisOptions;
  private db: Ioredis.Redis;

  constructor(db: any, options?: AccountsRedisOptions) {
    this.options = { ...defaultOptions, ...options };
    // TODO pass down options
    this.db = new Ioredis();
  }
}
