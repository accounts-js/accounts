import { type Redis } from 'ioredis';
import * as shortid from 'shortid';
import { Session, DatabaseInterfaceSessions, ConnectionInformations } from '@accounts/types';
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

export class RedisSessions implements DatabaseInterfaceSessions {
  private options: AccountsRedisOptions & typeof defaultOptions;
  private db: Redis;

  constructor(db: Redis, options: AccountsRedisOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
      timestamps: { ...defaultOptions.timestamps, ...options.timestamps },
    };
    if (!db) {
      throw new Error('A database connection is required');
    }
    this.db = db;
  }

  public async createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations = {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (await this.db.exists(`${this.options.sessionCollectionName}:${sessionId}`)) {
      await this.db.hmset(`${this.options.sessionCollectionName}:${sessionId}`, {
        userAgent: connection.userAgent ?? undefined,
        ip: connection.ip ?? undefined,
        [this.options.timestamps.updatedAt]: this.options.dateProvider(),
      });
    }
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    if (await this.db.exists(`${this.options.sessionCollectionName}:${sessionId}`)) {
      await this.db.hmset(`${this.options.sessionCollectionName}:${sessionId}`, {
        valid: 'false',
        [this.options.timestamps.updatedAt]: this.options.dateProvider(),
      });
    }
  }

  public async invalidateAllSessions(userId: string, excludedSessionIds?: string[]): Promise<void> {
    if (
      await this.db.exists(
        `${this.options.sessionCollectionName}:${this.options.userCollectionName}:${userId}`
      )
    ) {
      let sessionIds: string[] = await this.db.smembers(
        `${this.options.sessionCollectionName}:${this.options.userCollectionName}:${userId}`
      );

      if (excludedSessionIds && excludedSessionIds.length > 0) {
        sessionIds = sessionIds.filter((sessionId) => {
          return !excludedSessionIds.includes(sessionId);
        });
      }

      await sessionIds.map((sessionId) => this.invalidateSession(sessionId));
    }
  }

  public async findSessionByToken(token: string): Promise<Session | null> {
    if (await this.db.exists(`${this.options.sessionCollectionName}:token:${token}`)) {
      const sessionId = await this.db.get(`${this.options.sessionCollectionName}:token:${token}`);
      if (sessionId) {
        return this.findSessionById(sessionId);
      }
    }
    return null;
  }

  public async findSessionById(sessionId: string): Promise<Session | null> {
    if (await this.db.exists(`${this.options.sessionCollectionName}:${sessionId}`)) {
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
