import { Db, Collection, ObjectID } from 'mongodb';
import merge from 'lodash.merge';
import { DatabaseInterfaceSessions, ConnectionInformations, Session } from '@accounts/types';
import { AccountsMongoOptions } from './types';
import { defaultOptions } from './options';
import { toMongoID } from './utils';

export class MongoSessions implements DatabaseInterfaceSessions {
  // Db object
  private db: Db;
  // Options of Mongo class
  private options: AccountsMongoOptions & typeof defaultOptions;
  // Session collection
  private sessionCollection: Collection;

  constructor(db: Db, options: AccountsMongoOptions) {
    this.db = db;
    this.options = merge({ ...defaultOptions }, options);
    this.sessionCollection = this.db.collection(this.options.sessionCollectionName);
  }

  public async setupIndexes(): Promise<void> {
    await this.sessionCollection.createIndex('token', {
      unique: true,
      sparse: true,
    });
  }

  public async findSessionById(sessionId: string): Promise<Session | null> {
    const _id = this.options.convertSessionIdToMongoObjectId ? toMongoID(sessionId) : sessionId;
    const session = await this.sessionCollection.findOne({ _id });
    if (session) {
      session.id = session._id.toString();
    }
    return session;
  }

  public async findSessionByToken(token: string): Promise<Session | null> {
    const session = await this.sessionCollection.findOne({ token });
    if (session) {
      session.id = session._id.toString();
    }
    return session;
  }

  public async createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations = {},
    extraData?: object
  ): Promise<string> {
    const session = {
      userId,
      token,
      userAgent: connection.userAgent,
      ip: connection.ip,
      extraData,
      valid: true,
      [this.options.timestamps.createdAt]: this.options.dateProvider(),
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    };

    if (this.options.idProvider) {
      session._id = this.options.idProvider();
    }

    const ret = await this.sessionCollection.insertOne(session);
    return (ret.ops[0]._id as ObjectID).toString();
  }

  public async updateSession(
    sessionId: string,
    connection: ConnectionInformations,
    newToken?: string
  ): Promise<void> {
    const updateClause = {
      $set: {
        userAgent: connection.userAgent,
        ip: connection.ip,
        [this.options.timestamps.updatedAt]: this.options.dateProvider(),
      },
    };

    if (newToken) {
      updateClause.$set.token = newToken;
    }

    const _id = this.options.convertSessionIdToMongoObjectId ? toMongoID(sessionId) : sessionId;
    await this.sessionCollection.updateOne({ _id }, updateClause);
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    const _id = this.options.convertSessionIdToMongoObjectId ? toMongoID(sessionId) : sessionId;
    await this.sessionCollection.updateOne(
      { _id },
      {
        $set: {
          valid: false,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }

  public async invalidateAllSessions(userId: string): Promise<void> {
    await this.sessionCollection.updateMany(
      { userId },
      {
        $set: {
          valid: false,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }
}
