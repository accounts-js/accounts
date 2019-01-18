import { ConnectionInformations, CreateUser, DatabaseInterface, Session } from '@accounts/types';
import { Repository, getRepository } from 'typeorm';
import { User } from './entity/User';
import { UserEmail } from './entity/UserEmail';
import { UserService } from './entity/UserService';
import { UserSession } from './entity/UserSession';

type ISession = UserSession | Session;

export class Typeorm implements DatabaseInterface {
  private userRepository: Repository<User>;
  private emailRepository: Repository<UserEmail>;
  private serviceRepository: Repository<UserService>;
  private sessionRepository: Repository<UserSession>;

  constructor() {
    this.userRepository = getRepository(User);
    this.emailRepository = getRepository(UserEmail);
    this.serviceRepository = getRepository(UserService);
    this.sessionRepository = getRepository(UserSession);
  }

  public async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  public async findUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  public async findUserById(userId: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async findUserByResetPasswordToken(token: string): Promise<User | undefined> {
    const service = await this.serviceRepository.findOne({
      where: {
        name: 'password.reset',
        token,
      },
    });
    if (service) {
      return this.findUserById(service.userId);
    }
  }

  public async findUserByEmailVerificationToken(token: string): Promise<User | undefined> {
    const service = await this.serviceRepository.findOne({
      where: {
        name: 'email.verification',
        token,
      },
    });
    if (service) {
      return await this.findUserById(service.userId);
    }
  }

  public async createUser(createUser: CreateUser): Promise<string> {
    const { username, email, password } = createUser;

    const user = new User();

    if (email) {
      const userEmail = new UserEmail();
      userEmail.address = email;
      userEmail.verified = false;
      this.emailRepository.save(userEmail);
      user.emails = [userEmail];
    }

    if (password) {
      const userService = new UserService();
      userService.name = 'password';
      userService.options = { bcrypt: password };
      await this.serviceRepository.save(userService);
      user.allServices = [userService];
    }

    if (username) {
      user.username = username;
    }

    await this.userRepository.save(user);

    return user.id;
  }

  public async setUsername(userId: string, newUsername: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      user.username = newUsername;
      await this.userRepository.save(user);
    }
  }

  public async setProfile(userId: string, profile: object): Promise<object> {
    const user = await this.findUserById(userId);
    if (user) {
      user.profile = profile;
      await this.userRepository.save(user);
    }
    return profile;
  }

  public async findUserByServiceId(
    serviceName: string,
    serviceId: string
  ): Promise<User | undefined> {
    const service = await this.serviceRepository.findOne({
      name: serviceName,
      id: serviceId,
    });

    if (service) {
      return service.user;
    }
  }

  public async getService(userId: string, serviceName: string): Promise<UserService | undefined> {
    const user = await this.findUserById(userId);
    if (user) {
      return user.allServices.find(service => service.name === serviceName);
    }
  }

  public async setService(
    userId: string,
    serviceName: string,
    data: object,
    token?: string
  ): Promise<void> {
    let service = await this.getService(userId, serviceName);
    if (service) {
      if (token) {
        service.token = token;
      }
      service.options = data;
      await this.serviceRepository.save(service);
    } else {
      const user = await this.findUserById(userId);
      if (user) {
        service = new UserService();
        service.name = serviceName;
        service.user = user;
        service.options = data;
        await this.serviceRepository.save(service);
      }
    }
  }

  public async unsetService(userId: string, serviceName: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const service = user.allServices.find(s => s.name === serviceName);
      if (service) {
        await this.serviceRepository.remove(service);
      }
    }
  }

  public async findPasswordHash(userId: string): Promise<string | undefined> {
    const service = await this.getService(userId, 'password');
    if (service) {
      return service.options.bcrypt;
    }
  }

  public async setPassword(userId: string, newPassword: string): Promise<void> {
    const service = await this.getService(userId, 'password');
    if (service) {
      service.options = { bcrypt: newPassword };
      await this.serviceRepository.save(service);
    }
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

  public async setResetPassword(
    userId: string,
    email: string,
    newPassword: string,
    token: string
  ): Promise<void> {
    await this.setPassword(userId, newPassword);
    await this.unsetService(userId, 'password.reset');
  }

  public async addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const userEmail = new UserEmail();
      userEmail.user = user;
      userEmail.address = newEmail;
      userEmail.verified = verified;
      await this.userRepository.save(user);
    }
  }

  public async removeEmail(userId: string, email: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const userEmail = user.emails.find(s => s.address === email);
      if (!userEmail) {
        throw new Error('Email not found');
      }
      await this.emailRepository.remove(userEmail);
    }
  }

  public async verifyEmail(userId: string, email: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const userEmail = user.emails.find(s => s.address === email);
      if (!userEmail) {
        throw new Error('Email not found');
      }
      userEmail.verified = true;
      await this.emailRepository.save(userEmail);

      this.unsetService(userId, 'email.verification');
    }
  }

  public async addEmailVerificationToken(
    userId: string,
    email: string,
    token: string
  ): Promise<void> {
    await this.setService(
      userId,
      'email.verification',
      {
        address: email,
        when: new Date(),
      },
      token
    );
  }

  public async setUserDeactivated(userId: string, deactivated: boolean): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      user.deactivated = deactivated;
      await this.userRepository.save(user);
    }
  }

  public findSessionById(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.findOne(sessionId) as Promise<ISession>;
  }

  public findSessionByToken(token: string): Promise<ISession | null> {
    return this.sessionRepository.findOne({ token }) as Promise<ISession>;
  }

  public async createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations,
    extra?: object
  ): Promise<string | undefined> {
    const user = await this.findUserById(userId);
    if (user) {
      const session = new UserSession();
      session.user = user;
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
  }

  public async updateSession(sessionId: string, connection: ConnectionInformations): Promise<void> {
    const session = await this.findSessionById(sessionId);
    session.userAgent = connection.userAgent;
    session.ip = connection.ip;
    await this.sessionRepository.save(session);
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    const session = await this.findSessionById(sessionId);
    session.valid = false;
    await this.sessionRepository.save(session);
  }

  public async invalidateAllSessions(userId: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      await Promise.all(user.sessions.map(session => this.sessionRepository.remove(session)));
    }
  }
}
