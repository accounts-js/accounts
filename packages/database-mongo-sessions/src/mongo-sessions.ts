import { Collection, Db, ObjectId, CreateIndexesOptions } from 'mongodb';
import { ConnectionInformations, DatabaseInterfaceSessions, Session } from '@accounts/types';
import { toMongoID } from './utils';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface MongoSessionsOptions {
  /**
   * Mongo database object.
   */
  database: Db;
  /**
   * The sessions collection name.
   * Default 'sessions'.
   */
  sessionCollectionName?: string;
  /**
   * The timestamps for the sessions collection.
   * Default 'createdAt' and 'updatedAt'.
   */
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  /**
   * Should the session collection use _id as string or ObjectId.
   * If 'false' must include an 'idSessionProvider'.
   * Default 'true'.
   */
  convertSessionIdToMongoObjectId?: boolean;
  /**
   * Function that generates the _id for new Session objects.
   * If 'undefined' then 'convertSessionIdToMongoObjectId' must be 'true'.
   * Default 'undefined'
   */
  idSessionProvider?: () => string | object;
  /**
   * Function that generate the id for new User objects.
   */
  idProvider?: () => string | object;
  /**
   * Function that generate the date for the timestamps.
   * Default to `(date?: Date) => (date ? date.getTime() : Date.now())`.
   */
  dateProvider?: (date?: Date) => any;
}

const defaultOptions = {
  sessionCollectionName: 'sessions',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  convertSessionIdToMongoObjectId: true,
  dateProvider: (date?: Date) => (date ? date.getTime() : Date.now()),
};

export class MongoSessions implements DatabaseInterfaceSessions {
  // Merged options that can be used
  private options: MongoSessionsOptions & typeof defaultOptions;
  // Mongo database object
  private database: Db;
  // Mongo session collection
  private sessionCollection: Collection<
    PartialBy<Session & { _id?: string | object }, 'createdAt' | 'updatedAt' | 'id'>
  >;

  constructor(options: MongoSessionsOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
      timestamps: { ...defaultOptions.timestamps, ...options.timestamps },
    };

    if (
      typeof this.options.idSessionProvider === 'function' &&
      this.options.convertSessionIdToMongoObjectId
    ) {
      console.warn(`You have set both "options.idSessionProvider" and "options.convertSessionIdToMongoObjectId = true" which will cause your "options.idSessionProvider" to be ignored. 
      In order to fix this warning change "options.convertSessionIdToMongoObjectId" to "false" or remove your "options.idSessionProvider" from the configuration.
      `);
    }

    this.database = this.options.database;
    this.sessionCollection = this.database.collection(this.options.sessionCollectionName);
  }

  /**
   * Setup the mongo indexes needed for the sessions.
   * @param options Options passed to the mongo native `createIndex` method.
   */
  public async setupIndexes(
    options: Omit<CreateIndexesOptions, 'unique' | 'sparse'> = {}
  ): Promise<void> {
    // Token index used to query a session
    await this.sessionCollection.createIndex('token', {
      ...options,
      unique: true,
      sparse: true,
    });
  }

  /**
   * Create a new session attached to a user.
   * @param userId User id of the session.
   * @param token Random token used to identify the session.
   * @param connection Connection informations related to the session (such as user agent, ip etc..).
   * @param extraData Any extra data you would like to add. The data will be added to the root of the object.
   */
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

    if (this.options.idSessionProvider && !this.options.convertSessionIdToMongoObjectId) {
      session._id = this.options.idSessionProvider();
    }

    const ret = await this.sessionCollection.insertOne(session);
    // keep ret.ops for compatibility with MongoDB 3.X, version 4.X uses insertedId
    return ((ret.insertedId ? ret.insertedId : (ret as any).ops[0]._id) as ObjectId).toString();
  }

  /**
   * Get a session by his id.
   * @param sessionId Id used to query the session.
   */
  public async findSessionById(sessionId: string): Promise<Session | null> {
    const _id = this.options.convertSessionIdToMongoObjectId ? toMongoID(sessionId) : sessionId;
    const session = await this.sessionCollection.findOne({ _id });
    if (session) {
      session.id = session._id.toString();
    }
    return session as Session;
  }

  /**
   * Get a session by his token.
   * @param token Token used to query the session.
   */
  public async findSessionByToken(token: string): Promise<Session | null> {
    const session = await this.sessionCollection.findOne({ token });
    if (session) {
      session.id = session._id.toString();
    }
    return session as Session;
  }

  /**
   * Update the session informations, token and connection informations.
   * @param sessionId Id used to update the session.
   * @param connection Connection informations related to the session (such as user agent, ip etc..).
   * @param newToken New token that will replace the existing token for the session.
   */
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

  /**
   * Invalidate a session.
   * @param sessionId Id of the session to invalidate.
   */
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

  /**
   * Invalidate all the session of a user.
   * @param userId User id of the sessions.
   * @param excludedSessionIds Can be used to whitelist some sessions. Eg: close all the sessions except these ones.
   */
  public async invalidateAllSessions(userId: string, excludedSessionIds?: string[]): Promise<void> {
    const selector: { userId: string; _id?: object } = { userId };

    if (excludedSessionIds && excludedSessionIds.length > 0) {
      let excludedObjectIds: string[] | ObjectId[] = excludedSessionIds;

      if (this.options.convertSessionIdToMongoObjectId) {
        excludedObjectIds = excludedSessionIds.map((sessionId) => {
          return toMongoID(sessionId);
        });
      }

      selector._id = {
        $nin: excludedObjectIds,
      };
    }

    await this.sessionCollection.updateMany(selector, {
      $set: {
        valid: false,
        [this.options.timestamps.updatedAt]: this.options.dateProvider(),
      },
    });
  }
}
