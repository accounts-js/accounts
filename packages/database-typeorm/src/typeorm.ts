import {
  type ConnectionInformations,
  type CreateUser,
  type DatabaseInterface,
} from '@accounts/types';
import { type Repository, getRepository, Not, In, type FindOperator, Connection } from 'typeorm';
import { User } from './entity/User';
import { UserEmail } from './entity/UserEmail';
import { UserService } from './entity/UserService';
import { UserSession } from './entity/UserSession';
import {
  type AccountsTypeormOptions,
  AccountsTypeORMConfigToken,
  UserToken,
  UserEmailToken,
  UserServiceToken,
  UserSessionToken,
} from './types';
import { Inject, Injectable } from 'graphql-modules';

@Injectable({
  global: true,
})
export class AccountsTypeorm implements DatabaseInterface {
  private userRepository!: Repository<User>;
  private emailRepository!: Repository<UserEmail>;
  private serviceRepository!: Repository<UserService>;
  private sessionRepository!: Repository<UserSession>;

  constructor(
    @Inject(AccountsTypeORMConfigToken) private options: AccountsTypeormOptions,
    @Inject(Connection) private connection?: Connection,
    @Inject(UserToken) private UserEntity: typeof User = User,
    @Inject(UserEmailToken) private UserEmailEntity: typeof UserEmail = UserEmail,
    @Inject(UserServiceToken) private UserServiceEntity: typeof UserService = UserService,
    @Inject(UserSessionToken) private UserSessionEntity: typeof UserSession = UserSession
  ) {
    const setRepositories = () => {
      if (this.connection) {
        this.userRepository = this.connection.getRepository(this.UserEntity);
        this.emailRepository = this.connection.getRepository(this.UserEmailEntity);
        this.serviceRepository = this.connection.getRepository(this.UserServiceEntity);
        this.sessionRepository = this.connection.getRepository(this.UserSessionEntity);
      } else {
        this.userRepository = getRepository(this.UserEntity, this.options.connectionName);
        this.emailRepository = getRepository(this.UserEmailEntity, this.options.connectionName);
        this.serviceRepository = getRepository(this.UserServiceEntity, this.options.connectionName);
        this.sessionRepository = getRepository(this.UserSessionEntity, this.options.connectionName);
      }
    };

    // direct or lazy support
    if (connection && !connection.isConnected) {
      connection.connect().then(setRepositories);
    } else {
      setRepositories();
    }
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const userEmail = await this.emailRepository.findOne({
      where: { address: email.toLocaleLowerCase() },
      cache: this.options.cache,
    });

    if (userEmail) {
      return this.findUserById(userEmail.userId);
    }

    return null;
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
      cache: this.options.cache,
    });

    if (user) {
      return user;
    }

    return null;
  }

  public async findUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      cache: this.options.cache,
    });
    if (!user) {
      // throw new Error('User not found');
      return null;
    }
    return user;
  }

  public async findUserByResetPasswordToken(token: string): Promise<User | null> {
    const service = await this.serviceRepository.findOne({
      where: {
        name: 'password.reset',
        token,
      },
      cache: this.options.cache,
    });

    if (service) {
      return this.findUserById(service.userId);
    }

    return null;
  }

  public async findUserByEmailVerificationToken(token: string): Promise<User | null> {
    const service = await this.serviceRepository.findOne({
      where: {
        name: 'email.verificationTokens',
        token,
      },
      cache: this.options.cache,
    });

    if (service) {
      return this.findUserById(service.userId);
    }

    return null;
  }

  public async createUser(createUser: CreateUser): Promise<string> {
    const { username, email, password, ...otherFields } = createUser;

    const user = new this.UserEntity();

    if (email) {
      const userEmail = new this.UserEmailEntity();
      userEmail.address = email.toLocaleLowerCase();
      userEmail.verified = false;
      await this.emailRepository.save(userEmail);
      user.emails = [userEmail];
    }

    if (password) {
      const userService = new this.UserServiceEntity();
      userService.name = 'password';
      userService.options = { bcrypt: password };
      await this.serviceRepository.save(userService);
      user.allServices = [userService];
    }

    if (username) {
      user.username = username;
    }

    Object.assign(user, otherFields);

    await this.userRepository.save(user);

    return user.id;
  }

  public async setUsername(userId: string, newUsername: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      user.username = newUsername;
      await this.userRepository.save(user);
      return;
    }
    throw new Error('User not found');
  }

  public async findUserByServiceId(serviceName: string, serviceId: string): Promise<User | null> {
    const service = await this.serviceRepository.findOne({
      where: {
        name: serviceName,
        serviceId,
      },
      cache: this.options.cache,
    });

    if (service) {
      return this.findUserById(service.userId);
    }

    return null;
  }

  public async getService(userId: string, serviceName: string): Promise<UserService | null> {
    const user = await this.findUserById(userId);
    if (user) {
      const service = user.allServices.find((s) => s.name === serviceName);
      if (service) {
        return service;
      }
    }

    return null;
  }

  public async setService(
    userId: string,
    serviceName: string,
    data: object,
    token?: string
  ): Promise<void> {
    let service = await this.getService(userId, serviceName);

    if (!service) {
      const user = await this.findUserById(userId);
      if (user) {
        service = new this.UserServiceEntity();
        service.name = serviceName;
        service.user = user;
      }
    }

    const { id = null, ...options } = data as any;

    if (service) {
      service.options = options;

      if (id) {
        service.serviceId = id;
      }

      if (token) {
        service.token = token;
      }

      await this.serviceRepository.save(service);
    }
  }

  public async unsetService(userId: string, serviceName: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const service = user.allServices.find((s) => s.name === serviceName);
      if (service) {
        await this.serviceRepository.remove(service);
      }
    }
  }

  public async findPasswordHash(userId: string): Promise<string | null> {
    const service = await this.getService(userId, 'password');
    if (service) {
      return service.options.bcrypt;
    }
    return null;
  }

  public async setPassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      await this.setService(userId, 'password', { bcrypt: newPassword });
      await this.userRepository.update({ id: user.id }, {});
      return;
    }
    throw new Error('User not found');
  }

  public async addResetPasswordToken(
    userId: string,
    email: string,
    token: string,
    reason: string
  ): Promise<void> {
    await this.setService(
      userId,
      'password.reset',
      {
        address: email.toLocaleLowerCase(),
        when: new Date().toJSON(),
        reason,
      },
      token
    );
  }

  public async addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const userEmail = new this.UserEmailEntity();
      userEmail.user = user;
      userEmail.address = newEmail.toLocaleLowerCase();
      userEmail.verified = verified;
      await this.emailRepository.save(userEmail);
      await this.userRepository.update({ id: user.id }, {});
      return;
    }
    throw new Error('User not found');
  }

  public async removeEmail(userId: string, email: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const userEmail = user.emails.find((s) => s.address === email.toLocaleLowerCase());
      if (!userEmail) {
        throw new Error('Email not found');
      }
      await this.emailRepository.remove(userEmail);
      await this.userRepository.update({ id: user.id }, {});
      return;
    }
    throw new Error('User not found');
  }

  public async verifyEmail(userId: string, email: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const userEmail = user.emails.find((s) => s.address === email.toLocaleLowerCase());

      if (!userEmail) {
        throw new Error('Email not found');
      }
      userEmail.verified = true;
      await this.emailRepository.save(userEmail);
      await this.unsetService(userId, 'email.verificationTokens');
      await this.userRepository.update({ id: user.id }, {});
      return;
    }
    throw new Error('User not found');
  }

  public async addEmailVerificationToken(
    userId: string,
    email: string,
    token: string
  ): Promise<void> {
    await this.setService(
      userId,
      'email.verificationTokens',
      {
        address: email.toLocaleLowerCase(),
        when: new Date(),
      },
      token
    );
  }

  public async removeAllResetPasswordTokens(userId: string): Promise<void> {
    await this.unsetService(userId, 'password.reset');
  }

  public async setUserDeactivated(userId: string, deactivated: boolean): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      user.deactivated = deactivated;
      await this.userRepository.save(user);
    }
  }

  public async findSessionById(sessionId: string): Promise<UserSession | null> {
    try {
      const session = await this.sessionRepository.findOne({
        where: { id: sessionId },
        cache: this.options.cache,
      });

      if (session) {
        return session;
      }
    } catch (err) {
      // noop
    }

    return null;
  }

  public async findSessionByToken(token: string) {
    const session = await this.sessionRepository.findOne({
      where: { token },
      cache: this.options.cache,
    });
    if (!session) {
      return null;
    }
    return session;
  }

  public async findUserByLoginToken(token: string): Promise<User | null> {
    const service = await this.serviceRepository.findOne({
      where: {
        name: 'magicLink.loginTokens',
        token,
      },
      cache: this.options.cache,
    });

    if (service) {
      return this.findUserById(service.userId);
    }

    return null;
  }

  public async addLoginToken(userId: string, email: string, token: string) {
    await this.setService(
      userId,
      'magicLink.loginTokens',
      {
        address: email.toLocaleLowerCase(),
        when: new Date().toJSON(),
      },
      token
    );
  }

  public async removeAllLoginTokens(userId: string) {
    await this.unsetService(userId, 'magicLink.loginTokens');
  }

  public async createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations = {},
    extra?: object
  ) {
    const user = await this.findUserById(userId);
    const session = new this.UserSessionEntity();
    session.user = user!;
    session.token = token;
    session.userAgent = connection.userAgent;
    session.ip = connection.ip;
    if (extra) {
      session.extra = extra;
    }
    session.valid = true;
    await this.sessionRepository.save(session);

    return session.id;
  }

  public async updateSession(sessionId: string, connection: ConnectionInformations): Promise<void> {
    const session = await this.findSessionById(sessionId);
    if (session) {
      session.userAgent = connection.userAgent;
      session.ip = connection.ip;
      await this.sessionRepository.save(session);
    }
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    const session = await this.findSessionById(sessionId);
    if (session) {
      session.valid = false;
      await this.sessionRepository.save(session);
    }
  }

  public async invalidateAllSessions(userId: string, excludedSessionIds?: string[]): Promise<void> {
    const selector: { userId: string; id?: FindOperator<any> } = { userId };

    if (excludedSessionIds && excludedSessionIds.length > 0) {
      selector.id = Not(In(excludedSessionIds));
    }

    await this.sessionRepository.update(selector, {
      valid: false,
    });
  }
}
