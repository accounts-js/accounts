import * as Ioredis from 'ioredis';
import * as shortid from 'shortid';
import {
  CreateUser,
  User,
  Session,
  DatabaseInterface,
  ConnectionInformations,
} from '@accounts/types';
import { AccountsRedisOptions } from './types';

const defaultOptions = {
  userCollectionName: 'users',
  sessionCollectionName: 'sessions',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  idProvider: () => shortid.generate(),
  dateProvider: (date?: Date) => (date ? date.getTime() : Date.now()),
};

export class Redis implements DatabaseInterface {
  private options: AccountsRedisOptions;
  private db: Ioredis.Redis;

  constructor(db: any, options?: AccountsRedisOptions) {
    this.options = { ...defaultOptions, ...options };
    // TODO pass down options
    this.db = new Ioredis();
  }
}
