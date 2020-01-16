import { Repository, getRepository } from 'typeorm';
import { User, DatabaseInterfaceServicePassword } from '@accounts/types';
import { AccountsTypeormOptions } from '../types';
import { defaultOptions } from '../options';
import { UserEmail } from '../entity/UserEmail';
import { UserService } from '../entity/UserService';

export class TypeormPassword implements DatabaseInterfaceServicePassword {
  private options: AccountsTypeormOptions & typeof defaultOptions;
  private emailRepository: Repository<UserEmail> = null as any;
  private userRepository: Repository<User> = null as any;
  private serviceRepository: Repository<UserService> = null as any;

  constructor(options?: AccountsTypeormOptions) {
    this.options = { ...defaultOptions, ...options };

    const {
      connection,
      connectionName,
      userEntity,
      userEmailEntity,
      userServiceEntity,
    } = this.options;

    const setRepositories = () => {
      if (connection) {
        this.userRepository = connection.getRepository(userEntity);
        this.emailRepository = connection.getRepository(userEmailEntity);
        this.serviceRepository = connection.getRepository(userServiceEntity);
      } else {
        this.userRepository = getRepository(userEntity, connectionName);
        this.emailRepository = getRepository(userEmailEntity, connectionName);
        this.serviceRepository = getRepository(userServiceEntity, connectionName);
      }
    };

    // direct or lazy support
    if (connection && !connection.isConnected) {
      connection.connect().then(setRepositories);
    } else {
      setRepositories();
    }
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

  public async setResetPassword(
    userId: string,
    email: string,
    newPassword: string,
    token?: string
  ): Promise<void> {
    await this.setPassword(userId, newPassword);
    await this.unsetService(userId, 'password.reset');
  }

  public async addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      const userEmail = new this.options.userEmailEntity();
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
      const userEmail = user.emails.find(s => s.address === email.toLocaleLowerCase());
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
      const userEmail = user.emails.find(s => s.address === email.toLocaleLowerCase());

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
}
