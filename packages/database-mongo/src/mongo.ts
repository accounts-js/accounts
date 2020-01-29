import { CreateUser, DatabaseInterface, User } from '@accounts/types';
import merge from 'lodash.merge';
import { Collection, Db, ObjectID } from 'mongodb';
import { AccountsMongoOptions, MongoUser } from './types';
import { toMongoID } from './utils';
import { defaultOptions } from './options';
import { MongoSessions } from './sessions';
import { MongoServicePassword } from './services/password';

export class Mongo implements DatabaseInterface {
  // Options of Mongo class
  private options: AccountsMongoOptions & typeof defaultOptions;
  // Db object
  private db: Db;
  // Account collection
  private collection: Collection;
  private sessions: MongoSessions;
  private servicePassword: MongoServicePassword;

  constructor(db: any, options?: AccountsMongoOptions) {
    this.options = merge({ ...defaultOptions }, options);
    if (!db) {
      throw new Error('A database connection is required');
    }
    this.db = db;
    this.collection = this.db.collection(this.options.collectionName);
    this.sessions = new MongoSessions(this.db, this.options);
    this.servicePassword = new MongoServicePassword(this.db, this.options);
  }

  public async setupIndexes(): Promise<void> {
    await this.sessions.setupIndexes();
    await this.servicePassword.setupIndexes();
  }

  public async createUser({
    password,
    username,
    email,
    ...cleanUser
  }: CreateUser): Promise<string> {
    const user: MongoUser = {
      ...cleanUser,
      services: {},
      [this.options.timestamps.createdAt]: this.options.dateProvider(),
      [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    };
    if (password) {
      user.services.password = { bcrypt: password };
    }
    if (username) {
      user.username = username;
    }
    if (email) {
      user.emails = [{ address: email.toLowerCase(), verified: false }];
    }
    if (this.options.idProvider) {
      user._id = this.options.idProvider();
    }
    const ret = await this.collection.insertOne(user);
    return (ret.ops[0]._id as ObjectID).toString();
  }

  public async findUserById(userId: string): Promise<User | null> {
    const id = this.options.convertUserIdToMongoObjectId ? toMongoID(userId) : userId;
    const user = await this.collection.findOne({ _id: id });
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.collection.findOne({
      'emails.address': email.toLowerCase(),
    });
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    const filter = this.options.caseSensitiveUserName
      ? { username }
      : {
          $where: `obj.username && (obj.username.toLowerCase() === "${username.toLowerCase()}")`,
        };
    const user = await this.collection.findOne(filter);
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async findUserByServiceId(serviceName: string, serviceId: string): Promise<User | null> {
    const user = await this.collection.findOne({
      [`services.${serviceName}.id`]: serviceId,
    });
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  }

  public async setUsername(userId: string, newUsername: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId ? toMongoID(userId) : userId;
    const ret = await this.collection.updateOne(
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

  public async setService(userId: string, serviceName: string, service: object): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId ? toMongoID(userId) : userId;
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          [`services.${serviceName}`]: service,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }

  public async unsetService(userId: string, serviceName: string): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId ? toMongoID(userId) : userId;
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
        $unset: {
          [`services.${serviceName}`]: '',
        },
      }
    );
  }

  public async setUserDeactivated(userId: string, deactivated: boolean): Promise<void> {
    const id = this.options.convertUserIdToMongoObjectId ? toMongoID(userId) : userId;
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          deactivated,
          [this.options.timestamps.updatedAt]: this.options.dateProvider(),
        },
      }
    );
  }

  /**
   * Sessions
   */

  public get createSession(): DatabaseInterface['createSession'] {
    return this.sessions.createSession.bind(this.sessions);
  }

  public get updateSession(): DatabaseInterface['updateSession'] {
    return this.sessions.updateSession.bind(this.sessions);
  }

  public get invalidateSession(): DatabaseInterface['invalidateSession'] {
    return this.sessions.invalidateSession.bind(this.sessions);
  }

  public get invalidateAllSessions(): DatabaseInterface['invalidateAllSessions'] {
    return this.sessions.invalidateAllSessions.bind(this.sessions);
  }

  public get findSessionByToken(): DatabaseInterface['findSessionByToken'] {
    return this.sessions.findSessionByToken.bind(this.sessions);
  }

  public get findSessionById(): DatabaseInterface['findSessionById'] {
    return this.sessions.findSessionById.bind(this.sessions);
  }

  /**
   * Service Password
   */

  public get findUserByResetPasswordToken(): DatabaseInterface['findUserByResetPasswordToken'] {
    return this.servicePassword.findUserByResetPasswordToken.bind(this.servicePassword);
  }

  public get findUserByEmailVerificationToken(): DatabaseInterface['findUserByEmailVerificationToken'] {
    return this.servicePassword.findUserByEmailVerificationToken.bind(this.servicePassword);
  }

  public get findPasswordHash(): DatabaseInterface['findPasswordHash'] {
    return this.servicePassword.findPasswordHash.bind(this.servicePassword);
  }

  public get setPassword(): DatabaseInterface['setPassword'] {
    return this.servicePassword.setPassword.bind(this.servicePassword);
  }

  public get addEmailVerificationToken(): DatabaseInterface['addEmailVerificationToken'] {
    return this.servicePassword.addEmailVerificationToken.bind(this.servicePassword);
  }

  public get addResetPasswordToken(): DatabaseInterface['addResetPasswordToken'] {
    return this.servicePassword.addResetPasswordToken.bind(this.servicePassword);
  }

  public get setResetPassword(): DatabaseInterface['setResetPassword'] {
    return this.servicePassword.setResetPassword.bind(this.servicePassword);
  }

  public get addEmail(): DatabaseInterface['addEmail'] {
    return this.servicePassword.addEmail.bind(this.servicePassword);
  }

  public get removeEmail(): DatabaseInterface['removeEmail'] {
    return this.servicePassword.removeEmail.bind(this.servicePassword);
  }

  public get verifyEmail(): DatabaseInterface['verifyEmail'] {
    return this.servicePassword.verifyEmail.bind(this.servicePassword);
  }
}
