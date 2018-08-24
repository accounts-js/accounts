import * as fortune from 'fortune';
import { CreateUser } from '@accounts/types';

export interface DatabaseFortuneOptions {
  adapater?: any;
}

export class DatabaseFortune {
  private store;

  constructor(options?: DatabaseFortuneOptions) {
    this.store = fortune(
      {
        user: {
          username: String,
        },
        services: {},
      },
      options && options.adapater
    );
  }

  public async createUser({
    password,
    username,
    email,
    ...cleanUser
  }: CreateUser): Promise<string> {
    const res = await this.store.create('user', {
      username,
    });

    return res.payload.records[0].id;
  }
}
