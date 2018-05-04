import * as IORedis from 'ioredis';
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
  private db: IORedis.Redis;

  constructor(db: any, options?: AccountsRedisOptions) {
    this.options = { ...defaultOptions, ...options };
    this.db = new IORedis(this.options.ioredis);
  }

  public async createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations = {},
    extraData?: object
  ): Promise<string> {
    const sessionId = this.options.idProvider();
    const pipeline = this.db.pipeline();
    pipeline.hmset(`${this.options.sessionCollectionName}:${sessionId}`, {
      userId,
      token,
      userAgent: connection.userAgent,
      ip: connection.ip,
      valid: true,
      [this.options.timestamps.createdAt]: this.options.dateProvider(),
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    });
    // Push the sessionId inside the userId
    pipeline.sadd(
      `${this.options.sessionCollectionName}:${this.options.userCollectionName}:${userId}`,
      sessionId
    );
    // Link the session token to the sessionId
    pipeline.set(`${this.options.sessionCollectionName}:token:${token}`, sessionId);
    await pipeline.exec();
    return sessionId;
  }

  public async updateSession(sessionId: string, connection: ConnectionInformations): Promise<void> {
    if (this.db.exists(`${this.options.sessionCollectionName}:${sessionId}`)) {
      await this.db.hmset(`${this.options.sessionCollectionName}:${sessionId}`, {
        userAgent: connection.userAgent,
        ip: connection.ip,
        [this.options.timestamps.updatedAt]: this.options.dateProvider(),
      });
    }
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    if (this.db.exists(`${this.options.sessionCollectionName}:${sessionId}`)) {
      await this.db.hmset(`${this.options.sessionCollectionName}:${sessionId}`, {
        valid: false,
        [this.options.timestamps.updatedAt]: this.options.dateProvider(),
      });
    }
  }

  public async invalidateAllSessions(userId: string): Promise<void> {
    // TODO
  }

  public async findSessionByToken(token: string): Promise<Session | null> {
    if (this.db.exists(`${this.options.sessionCollectionName}:token:${token}`)) {
      const sessionId = await this.db.get(`${this.options.sessionCollectionName}:token:${token}`);
      return this.findSessionById(sessionId);
    }
    return null;
  }

  public async findSessionById(sessionId: string): Promise<Session | null> {
    if (this.db.exists(`${this.options.sessionCollectionName}:${sessionId}`)) {
      const session = await this.db.hgetall(`${this.options.sessionCollectionName}:${sessionId}`);
      return this.formatSession(sessionId, session);
    }
    return null;
  }

  /**
   * We need to format the session to have an object the server can understand.
   */
  private formatSession(sessionId: string, session: any): Session {
    // Redis doesn't store boolean values, so we need turn this string into a boolean
    session.valid = session.valid === 'true';
    return { id: sessionId, ...session };
  }
}
