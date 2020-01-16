import { CreateUser, DatabaseInterface } from '@accounts/types';
import { Repository, getRepository } from 'typeorm';
import { User } from './entity/User';
import { UserEmail } from './entity/UserEmail';
import { UserService } from './entity/UserService';
import { AccountsTypeormOptions } from './types';
import { defaultOptions } from './options';

export class AccountsTypeorm implements DatabaseInterface {
  private options: AccountsTypeormOptions & typeof defaultOptions;
  private userRepository: Repository<User> = null as any;
  private emailRepository: Repository<UserEmail> = null as any;
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
    const user = await this.userRepository.findOne(userId, {
      cache: this.options.cache,
    });
    if (!user) {
      // throw new Error('User not found');
      return null;
    }
    return user;
  }

  public async createUser(createUser: CreateUser): Promise<string> {
    const { username, email, password, ...otherFields } = createUser;

    const user = new this.options.userEntity();

    if (email) {
      const userEmail = new this.options.userEmailEntity();
      userEmail.address = email.toLocaleLowerCase();
      userEmail.verified = false;
      await this.emailRepository.save(userEmail);
      user.emails = [userEmail];
    }

    if (password) {
      const userService = new this.options.userServiceEntity();
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
      name: serviceName,
      serviceId,
      cache: this.options.cache,
    } as any);

    if (service) {
      return this.findUserById(service.userId);
    }

    return null;
  }

  public async getService(userId: string, serviceName: string): Promise<UserService | null> {
    const user = await this.findUserById(userId);
    if (user) {
      const service = user.allServices.find(s => s.name === serviceName);
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
        service = new this.options.userServiceEntity();
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
      const service = user.allServices.find(s => s.name === serviceName);
      if (service) {
        await this.serviceRepository.remove(service);
      }
    }
  }

  public async setUserDeactivated(userId: string, deactivated: boolean): Promise<void> {
    const user = await this.findUserById(userId);
    if (user) {
      user.deactivated = deactivated;
      await this.userRepository.save(user);
    }
  }
}
