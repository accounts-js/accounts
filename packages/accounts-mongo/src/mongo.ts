import { ObjectID, Db, Collection } from 'mongodb';
import { get } from 'lodash';
import { CreateUserType, UserObjectType, SessionType } from '@accounts/common';
import { DBInterface } from '@accounts/server';

export interface MongoOptionsType {
  // The users collection name, default 'users'.
  collectionName?: string;
  // The sessions collection name, default 'sessions'.
  sessionCollectionName?: string;
  // The timestamps for the users and sessions collection, default 'createdAt' and 'updatedAt'.
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  // Should the user collection use _id as string or ObjectId, default 'true'.
  convertUserIdToMongoObjectId?: boolean;
  // Should the session collection use _id as string or ObjectId, default 'true'.
  convertSessionIdToMongoObjectId?: boolean;
  // Perform case intensitive query for user name, default 'true'.
  caseSensitiveUserName?: boolean;
  // Function that generate the id for new objects.
  idProvider?: () => string | object;
  // Function that generate the date for the timestamps.
  dateProvider?: (date?: Date) => any;
}

export interface MongoUserObjectType {
  _id?: string | object;
  username?: string;
  profile?: object;
  services: {
    password?: {
      bcrypt: string;
    };
  };
  emails?: [
    {
      address: string;
      verified: boolean;
    }
  ];
}

const toMongoID = objectId => {
  if (typeof objectId === 'string') {
    return new ObjectID(objectId);
  }
  return objectId;
};

const defaultOptions = {
  collectionName: 'users',
  sessionCollectionName: 'sessions',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  convertUserIdToMongoObjectId: true,
  convertSessionIdToMongoObjectId: true,
  caseSensitiveUserName: true,
  idProvider: null,
  dateProvider: (date?: Date) => (date ? date.getTime() : Date.now()),
};

export class Mongo implements DBInterface {
  // Options of Mongo class
  private options: MongoOptionsType;
  // Db object
  private db: Db;
  // Account collection
  private collection: Collection;
  // Session collection
  private sessionCollection: Collection;

  constructor(db: any, options?: MongoOptionsType) {
    this.options = { ...defaultOptions, ...options };
    if (!db) {
      throw new Error('A database connection is required');
    }
    this.db = db;
    this.collection = this.db.collection(this.options.collectionName);
    this.sessionCollection = this.db.collection(
      this.options.sessionCollectionName
    );
  }

  public async setupIndexes(): Promise<void> {
    await this.collection.createIndex('username', {
      unique: true,
      sparse: true,
    });
    await this.collection.createIndex('emails.address', {
      unique: true,
      sparse: true,
    });
  }

  public async createUser(options: CreateUserType): Promise<string> {
    const user: MongoUserObjectType = {
      services: {},
      profile: {},
      [this.options.timestamps.createdAt]: this.options.dateProvider(),
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    };
    if (options.password) {
      user.services.password = { bcrypt: options.password };
    }
    if (options.username) {
      user.username = options.username;
    }
    if (options.email) {
      user.emails = [{ address: options.email.toLowerCase(), verified: false }];
    }
    if (options.profile) {
      user.profile = options.profile;
    }
    if (this.options.idProvider) {
      user._id = this.options.idProvider();
    }
    const ret = await this.collection.insertOne(user);
    return ret.ops[0]._id;
  }

  public async findUserById(userId: string): Promise<UserObjectType | null> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const user = await this.collection.findOne({ _id: id });
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  public async findUserByEmail(email: string): Promise<UserObjectType | null> {
    const user = await this.collection.findOne({
      'emails.address': email.toLowerCase(),
    });
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  public async findUserByUsername(
    username: string
  ): Promise<UserObjectType | null> {
    const filter = this.options.caseSensitiveUserName
      ? { username }
      : {
          $where: `obj.username && (obj.username.toLowerCase() === "${username.toLowerCase()}")`,
        };
    const user = await this.collection.findOne(filter);
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  public async findPasswordHash(userId: string): Promise<string | null> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const user = await this.findUserById(id);
    if (user) {
      return get(user, 'services.password.bcrypt');
    }
    return null;
  }

  public async findUserByEmailVerificationToken(
    token: string
  ): Promise<UserObjectType | null> {
    const user = await this.collection.findOne({
      'services.email.verificationTokens.token': token,
    });
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  public async findUserByResetPasswordToken(
    token: string
  ): Promise<UserObjectType | null> {
    const user = await this.collection.findOne({
      'services.password.reset.token': token,
    });
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  public async findUserByServiceId(
    serviceName: string,
    serviceId: string
  ): Promise<UserObjectType | null> {
    const user = await this.collection.findOne({
      [`services.${serviceName}.id`]: serviceId,
    });
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  public async addEmail(
    userId: string,
    newEmail: string,
    verified: boolean
  ): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.update(
      { _id: id },
      {
        $addToSet: {
          emails: {
            address: newEmail.toLowerCase(),
            verified,
          },
        },
        $set: {
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  public async removeEmail(userId: string, email: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.update(
      { _id: id },
      {
        $pull: { emails: { address: email.toLowerCase() } },
        $set: {
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  public async verifyEmail(userId: string, email: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.update(
      { _id: id, 'emails.address': email },
      {
        $set: {
          'emails.$.verified': true,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
        $pull: { 'services.email.verificationTokens': { address: email } },
      }
    );
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  public async setUsername(userId: string, newUsername: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.update(
      { _id: id },
      {
        $set: {
          username: newUsername,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  public async setPassword(userId: string, newPassword: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    const ret = await this.collection.update(
      { _id: id },
      {
        $set: {
          'services.password.bcrypt': newPassword,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
        $unset: {
          'services.password.reset': '',
        },
      }
    );
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  public async setProfile(userId: string, profile: object): Promise<object> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    await this.collection.update(
      { _id: id },
      {
        $set: {
          profile,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
    return profile;
  }

  public async setService(
    userId: string,
    serviceName: string,
    service: object
  ): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId
      ? toMongoID(userId)
      : userId;
    await this.collection.update(
      { _id: id },
      {
        $set: {
          [`services.${serviceName}`]: service,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }

  public async createSession(
    userId: string,
    ip?: string,
    userAgent?: string,
    extraData?: object
  ): Promise<string> {
    const session = {
      userId,
      userAgent,
      ip,
      extraData,
      valid: true,
      [this.options.timestamps.createdAt]: this.options.dateProvider(),
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    };

    if (this.options.idProvider) {
      session._id = this.options.idProvider();
    }

    const ret = await this.sessionCollection.insertOne(session);
    return ret.ops[0]._id;
  }

  public async updateSession(
    sessionId: string,
    ip: string,
    userAgent: string
  ): Promise<void> {
    // tslint:disable-next-line variable-name
    const _id = this.options.convertSessionIdToMongoObjectId
      ? toMongoID(sessionId)
      : sessionId;
    await this.sessionCollection.update(
      { _id },
      {
        $set: {
          ip,
          userAgent,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    // tslint:disable-next-line variable-name
    const _id = this.options.convertSessionIdToMongoObjectId
      ? toMongoID(sessionId)
      : sessionId;
    await this.sessionCollection.update(
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

  public findSessionById(sessionId: string): Promise<SessionType | null> {
    // tslint:disable-next-line variable-name
    const _id = this.options.convertSessionIdToMongoObjectId
      ? toMongoID(sessionId)
      : sessionId;
    return this.sessionCollection.findOne({ _id });
  }

  public async addEmailVerificationToken(
    userId: string,
    email: string,
    token: string
  ): Promise<void> {
    await this.collection.update(
      { _id: userId },
      {
        $push: {
          'services.email.verificationTokens': {
            token,
            address: email.toLowerCase(),
            when: this.options.dateProvider(),
          },
        },
      }
    );
  }

  public async addResetPasswordToken(
    userId: string,
    email: string,
    token: string,
    reason: string = 'reset'
  ): Promise<void> {
    await this.collection.update(
      { _id: userId },
      {
        $push: {
          'services.password.reset': {
            token,
            address: email.toLowerCase(),
            when: this.options.dateProvider(),
            reason,
          },
        },
      }
    );
  }

  public async setResetPassword(
    userId: string,
    email: string,
    newPassword: string
  ): Promise<void> {
    await this.setPassword(userId, newPassword);
  }
}
