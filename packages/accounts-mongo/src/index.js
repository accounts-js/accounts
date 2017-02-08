// @flow

import { get } from 'lodash';
import { encryption } from '@accounts/server';
import type {
  CreateUserType,
  UserObjectType,
  SessionType,
} from '@accounts/common';
import { ObjectID } from 'mongodb';

export type MongoOptionsType = {
  collectionName: string,
  sessionCollectionName: string,
  timestamps: {
    createdAt: string,
    updatedAt: string,
  }
};

export type MongoUserObjectType = {
  username?: string,
  profile?: Object,
  services: {
    password?: {
      bcrypt: string,
    },
  },
  emails?: [{
    address: string,
    verified: boolean,
  }],
};

const toMongoID = (objectId) => {
  if (typeof objectId === 'string') {
    return new ObjectID(objectId);
  }

  return objectId;
};

class Mongo {
  options: MongoOptionsType;
  // TODO definition for mongodb connection object
  db: any;
  collection: any;
  sessionCollection: any;

  constructor(db: any, options: MongoOptionsType) {
    const defaultOptions = {
      collectionName: 'users',
      sessionCollectionName: 'sessions',
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      },
    };
    this.options = { ...defaultOptions, ...options };
    if (get(db, 'constructor.define.name') !== 'Db') {
      throw new Error('A valid database connection object is required');
    }
    this.db = db;
    this.collection = this.db.collection(this.options.collectionName);
    this.sessionCollection = this.db.collection(this.options.sessionCollectionName);
  }

  async setupIndexes(): Promise<void> {
    await this.collection.createIndex('username', { unique: 1, sparse: 1 });
    await this.collection.createIndex('emails.address', { unique: 1, sparse: 1 });
  }

  async createUser(options: CreateUserType): Promise<string> {
    const user: MongoUserObjectType = {
      services: {},
      profile: {},
      [this.options.timestamps.createdAt]: Date.now(),
      [this.options.timestamps.updatedAt]: Date.now(),
    };
    if (options.password) {
      user.services.password = { bcrypt: await encryption.hashPassword(options.password) };
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
    const ret = await this.collection.insertOne(user);
    return ret.ops[0]._id;
  }

  async findUserById(userId: string): Promise<?UserObjectType> {
    const user = await this.collection.findOne({ _id: toMongoID(userId) });
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<?UserObjectType> {
    const user = await this.collection.findOne({ 'emails.address': email.toLowerCase() });
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  async findUserByUsername(username: string): Promise<?UserObjectType> {
    const user = await this.collection.findOne({ username });
    if (user) {
      user.id = user._id;
    }
    return user;
  }

  async findPasswordHash(userId: string): Promise<?string> {
    const user = await this.findUserById(toMongoID(userId));
    if (user) {
      return user.services.password.bcrypt;
    }
    return null;
  }

  async addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    const ret = await this.collection.update({ _id: toMongoID(userId) }, {
      $addToSet: {
        emails: {
          address: newEmail.toLowerCase(),
          verified,
        },
      },
      $set: { [this.options.timestamps.updatedAt]: Date.now() },
    });
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  async removeEmail(userId: string, email: string): Promise<void> {
    const ret = await this.collection.update({ _id: toMongoID(userId) }, {
      $pull: { emails: { address: email.toLowerCase() } },
      $set: { [this.options.timestamps.updatedAt]: Date.now() },
    });
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  async setUsername(userId: string, newUsername: string): Promise<void> {
    const ret = await this.collection.update({ _id: toMongoID(userId) }, {
      $set: {
        username: newUsername,
        [this.options.timestamps.updatedAt]: Date.now(),
      },
    });
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  async setPasssword(userId: string, newPassword: string): Promise<void> {
    const ret = await this.collection.update({ _id: toMongoID(userId) }, {
      $set: {
        'services.password.bcrypt': await encryption.hashPassword(newPassword),
        [this.options.timestamps.updatedAt]: Date.now(),
      },
    });
    if (ret.result.nModified === 0) {
      throw new Error('User not found');
    }
  }

  async setProfile(userId: string, profile: Object): Promise<Object> {
    await this.collection.update({ _id: toMongoID(userId) }, {
      $set: {
        profile,
        [this.options.timestamps.updatedAt]: Date.now(),
      },
    });
    const user = await this.findUserById(userId);
    return user && user.profile;
  }

  async createSession(userId: string, ip: string, userAgent: string): Promise<string> {
    const ret = await this.sessionCollection.insertOne({
      userId,
      userAgent,
      ip,
      valid: true,
      [this.options.timestamps.createdAt]: Date.now(),
      [this.options.timestamps.updatedAt]: Date.now(),
    });
    return ret.ops[0]._id;
  }

  async updateSession(sessionId: string, ip: string, userAgent: string): Promise<void> {
    await this.sessionCollection.update({ _id: toMongoID(sessionId) }, {
      $set: {
        ip,
        userAgent,
        [this.options.timestamps.updatedAt]: Date.now(),
      },
    });
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.sessionCollection.update({ _id: toMongoID(sessionId) }, {
      $set: {
        valid: false,
        [this.options.timestamps.updatedAt]: Date.now(),
      },
    });
  }

  findSessionById(sessionId: string): Promise<?SessionType> {
    return this.sessionCollection.findOne({ _id: toMongoID(sessionId) });
  }
}

export default Mongo;
