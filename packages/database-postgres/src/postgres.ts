import {
  CreateUser,
  User,
  Session,
  DatabaseInterface,
  ConnectionInformations,
} from '@accounts/types';
import * as PgPromise from 'pg-promise';
import { AccountsPostgresOptions } from './types';
import { merge, isEmpty } from 'lodash';
import { PostgresUser, PostgresEmail, PostgresServices } from './types/index';

const defaultOptions = {
  userTableName: 'users',
  sessionTableName: 'user_sessions',
  emailTable: 'user_emails',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  caseSensitiveUserName: true,
  dateProvider: (date?: Date) => (date ? date.getTime() : Date.now()),
};

export class Postgres implements DatabaseInterface {
  // Options of Postgres class
  private options: AccountsPostgresOptions & typeof defaultOptions;
  // Db object
  private db: PgPromise.IDatabase<any>;

  constructor(options?: AccountsPostgresOptions) {
    this.options = merge({ ...defaultOptions }, options);

    if (options && options.db) {
      this.db = options.db;
    } else if (options && !isEmpty(options.uri)) {
      const pgp = PgPromise({
        connect(client) {
          client.query(
            'CREATE TABLE ${table~} (id bigserial primay key, username text, password text)'
          );
        },
      });

      this.db = pgp(options.uri);
    } else {
      throw new Error('options.db is required');
    }
  }

  public findUserByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  public findUserByUsername(username: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  public findUserById(userId: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  public async createUser({
    password,
    username,
    email,
    ...cleanUser
  }: CreateUser): Promise<string> {
    const user: PostgresUser = {
      [this.options.timestamps.createdAt]: this.options.dateProvider(),
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    };

    const services: PostgresServices = {};

    const emails: PostgresEmail[] = [];

    if (password) {
      services.password = { bcrypt: password };
    }
    if (username) {
      user.username = username;
    }
    if (email) {
      emails.push({ address: email.toLowerCase(), verified: false });
    }
    if (cleanUser) {
      user.profile = JSON.stringify(cleanUser);
    }

    // tslint:disable-next-line:no-invalid-template-strings
    const id = await this.db.one(
      'INSERT INTO ${table~} (username, password) VALUES (${username}, ${profile}, ${password}) RETURNING id',
      {
        ...user,
        table: this.options.userTableName,
      }
    );

    return id;
  }

  public setUsername(userId: string, newUsername: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public setProfile(userId: string, profile: object): Promise<object> {
    throw new Error('Method not implemented.');
  }
  public findUserByServiceId(serviceName: string, serviceId: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  public setService(userId: string, serviceName: string, data: object): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public unsetService(userId: string, serviceName: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public findPasswordHash(userId: string): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  public findUserByResetPasswordToken(token: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  public setPassword(userId: string, newPassword: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public addResetPasswordToken(
    userId: string,
    email: string,
    token: string,
    reason: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public setResetPassword(
    userId: string,
    email: string,
    newPassword: string,
    token: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public findUserByEmailVerificationToken(token: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  public addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public removeEmail(userId: string, email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public verifyEmail(userId: string, email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public addEmailVerificationToken(userId: string, email: string, token: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public setUserDeactivated(userId: string, deactivated: boolean): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public findSessionById(sessionId: string): Promise<Session | null> {
    throw new Error('Method not implemented.');
  }
  public findSessionByToken(token: string): Promise<Session | null> {
    throw new Error('Method not implemented.');
  }
  public createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations,
    extraData?: object | undefined
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public updateSession(sessionId: string, connection: ConnectionInformations): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public invalidateSession(sessionId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public invalidateAllSessions(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
