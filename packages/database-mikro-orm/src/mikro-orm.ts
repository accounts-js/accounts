import {
  type ConnectionInformations,
  type CreateUser,
  type DatabaseInterface,
} from '@accounts/types';
import { type IUser, getUserCtor } from './entity/User';
import { Email } from './entity/Email';
import { Service } from './entity/Service';
import { Session } from './entity/Session';
import { EmailToken, ServiceToken, SessionToken, UserToken } from './types';
import {
  type Connection,
  type Constructor,
  EntityManager,
  type IDatabaseDriver,
  RequestContext,
} from '@mikro-orm/core';
import { type User as AccountsUser } from '@accounts/types/lib/types/user';
import { type Session as ISession } from '@accounts/types/lib/types/session/session';
import { ExecutionContext, Inject, Injectable } from 'graphql-modules';
import { get, set } from 'lodash';

const hasPassword = (opt: object): opt is { bcrypt: string } =>
  !!(opt as { bcrypt: string }).bcrypt;

const toUser = async (user: IUser<any, any, any> | null): Promise<AccountsUser | null> =>
  user && {
    ...user,
    id: String(user.id),
    emails: await user.emails.loadItems(),
    services: (await user.services.loadItems()).reduce(
      (acc, { name, token, options }: { name: string; token?: string; options?: object }) => {
        const multi = ['email.verificationTokens', 'password.reset'];
        set(
          acc,
          name,
          multi.includes(name)
            ? (get(acc, name) ?? []).concat({ token, ...options })
            : { ...get(acc, name), token, ...options }
        );
        return acc;
      },
      {}
    ),
  };

const toSession = async (session: Session<any> | null): Promise<ISession | null> =>
  session && {
    ...session,
    id: String(session.id),
    userId: String((session.user as any).id), //FIXME
    createdAt: session.createdAt.toDateString(),
    updatedAt: session.updatedAt.toDateString(),
  };

@Injectable({
  global: true,
})
export class AccountsMikroOrm<
  CustomUser extends IUser<any, any, any>,
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>,
> implements DatabaseInterface
{
  @ExecutionContext() private context?: ExecutionContext & {
    em?: EntityManager<IDatabaseDriver<Connection>>;
  };

  private get em() {
    const em =
      RequestContext.getEntityManager() ??
      this.context?.em ??
      this.context?.injector.get(EntityManager);
    if (!em) {
      throw new Error('Cannot find EntityManager');
    }
    return em;
  }
  private UserEntity!: Constructor<CustomUser | IUser<any, any, any>>;
  private EmailEntity: Constructor<CustomEmail | Email<any>> = Email;
  private ServiceEntity: Constructor<CustomService | Service<any>> = Service;
  private SessionEntity: Constructor<CustomSession | Session<any>> = Session;

  private get userRepository() {
    return this.em.getRepository<IUser<any, any, any>>(this.UserEntity);
  }
  private get emailRepository() {
    return this.em.getRepository<Email<any>>(this.EmailEntity);
  }
  private get serviceRepository() {
    return this.em.getRepository<Service<any>>(this.ServiceEntity);
  }
  private get sessionRepository() {
    return this.em.getRepository<Session<any>>(this.SessionEntity);
  }

  constructor(
    @Inject(EmailToken) EmailEntity?: Constructor<CustomEmail | Email<any>>,
    @Inject(ServiceToken) ServiceEntity?: Constructor<CustomService | Service<any>>,
    @Inject(SessionToken) SessionEntity?: Constructor<CustomSession | Session<any>>,
    @Inject(UserToken) UserEntity?: Constructor<CustomUser | IUser<any, any, any>>
  ) {
    if (EmailEntity) {
      this.EmailEntity = EmailEntity;
    }
    if (ServiceEntity) {
      this.ServiceEntity = ServiceEntity;
    }
    if (SessionEntity) {
      this.SessionEntity = SessionEntity;
    }
    this.UserEntity = getUserCtor({
      EmailEntity: this.EmailEntity,
      ServiceEntity: this.ServiceEntity,
    });
    if (UserEntity) {
      this.UserEntity = UserEntity;
    }
  }

  public async findUserByEmail(email: string): Promise<AccountsUser | null> {
    return toUser(
      await this.userRepository.findOne({
        emails: {
          address: email.toLocaleLowerCase(),
        },
      })
    );
  }

  public async findUserByUsername(username: string): Promise<AccountsUser | null> {
    return toUser(await this.userRepository.findOne({ username }));
  }

  public async findUserById(userId: string): Promise<AccountsUser | null> {
    return toUser(await this.userRepository.findOne(Number(userId)));
  }

  public async findUserByResetPasswordToken(token: string): Promise<AccountsUser | null> {
    return toUser(
      await this.userRepository.findOne({
        services: {
          name: 'password.reset',
          token,
        },
      })
    );
  }

  public async findUserByEmailVerificationToken(token: string): Promise<AccountsUser | null> {
    return toUser(
      await this.userRepository.findOne({
        services: {
          name: 'email.verificationTokens',
          token,
        },
      })
    );
  }

  public async createUser({
    username,
    email,
    password,
    ...otherFields
  }: CreateUser): Promise<string> {
    const user = new this.UserEntity({
      email,
      password,
      username,
      ...otherFields,
    });
    await this.em.persistAndFlush(user);

    return String(user.id);
  }

  public async setUsername(userId: string, newUsername: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail(Number(userId));
    user.username = newUsername;
    await this.em.flush();
  }

  public async findUserByServiceId(
    serviceName: string,
    serviceId: string
  ): Promise<AccountsUser | null> {
    return toUser(await this.userRepository.findOne({ services: Number(serviceId) }));
  }

  public async setService(
    userId: string,
    serviceName: string,
    data: object,
    token?: string,
    flush = true
  ): Promise<void> {
    const service =
      (await this.serviceRepository.findOne({
        name: serviceName,
        user: Number(userId),
      })) ??
      new this.ServiceEntity({
        name: serviceName,
        user: this.em.getReference(this.UserEntity, Number(userId), { wrapped: true }),
      });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...options } = data as any;

    service.options = options;

    if (token) {
      service.token = token;
    }

    this.em.persist(service);

    if (flush) {
      return this.em.flush();
    }
  }

  public async unsetService(userId: string, serviceName: string): Promise<void> {
    this.em.remove(
      await this.serviceRepository.findOneOrFail({
        name: serviceName,
        user: Number(userId),
      })
    );
    return this.em.flush();
  }

  public async findPasswordHash(userId: string): Promise<string | null> {
    const service = await this.serviceRepository.findOne({
      name: 'password',
      user: Number(userId),
    });
    return service?.options && hasPassword(service.options) ? service.options.bcrypt : null;
  }

  public async setPassword(userId: string, newPassword: string, flush = true): Promise<void> {
    return await this.setService(userId, 'password', { bcrypt: newPassword }, undefined, flush);
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

  public async setResetPassword(userId: string, email: string, newPassword: string): Promise<void> {
    await this.setPassword(userId, newPassword, false);
    return this.unsetService(userId, 'password.reset');
  }

  public async addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    return this.em.persistAndFlush(
      new this.EmailEntity({
        user: this.em.getReference(this.UserEntity, Number(userId), { wrapped: true }),
        address: newEmail,
        verified,
      })
    );
  }

  public async removeEmail(userId: string, email: string): Promise<void> {
    try {
      this.em.remove(
        await this.emailRepository.findOneOrFail({
          address: email.toLocaleLowerCase(),
        })
      );
    } catch {
      throw new Error('Email not found');
    }
    return this.em.flush();
  }

  public async verifyEmail(userId: string, email: string): Promise<void> {
    const userEmail = await this.emailRepository.findOneOrFail({
      address: email.toLocaleLowerCase(),
    });
    userEmail.verified = true;
    return this.unsetService(userId, 'email.verificationTokens');
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
    const user = await this.userRepository.findOneOrFail(Number(userId));
    user.deactivated = deactivated;
    return this.em.flush();
  }

  public async findSessionById(sessionId: string): Promise<ISession | null> {
    return toSession(await this.sessionRepository.findOne(Number(sessionId)));
  }

  public async findSessionByToken(token: string): Promise<ISession | null> {
    return toSession(await this.sessionRepository.findOne({ token }));
  }

  public async findUserByLoginToken(token: string): Promise<AccountsUser | null> {
    const service = await this.serviceRepository.findOne({
      name: 'magicLink.loginTokens',
      token,
    });

    if (service) {
      return this.findUserById((service.user as any).id); //FIXME
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
  ): Promise<string> {
    const session = new this.SessionEntity({
      user: this.em.getReference(this.UserEntity, Number(userId), { wrapped: true }),
      token,
      userAgent: connection.userAgent,
      ip: connection.ip,
      extra,
      valid: true,
    });
    await this.em.persistAndFlush(session);
    return String(session.id);
  }

  public async updateSession(sessionId: string, connection: ConnectionInformations): Promise<void> {
    const session = await this.sessionRepository.findOneOrFail(Number(sessionId));
    session.userAgent = connection.userAgent ?? undefined;
    session.ip = connection.ip ?? undefined;
    return this.em.flush();
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findOneOrFail(Number(sessionId));
    session.valid = false;
    return this.em.flush();
  }

  public async invalidateAllSessions(userId: string, excludedSessionIds?: string[]): Promise<void> {
    const sessions = await this.sessionRepository.find({
      user: this.em.getReference(this.UserEntity, Number(userId), { wrapped: true }),
      ...(excludedSessionIds?.length && {
        id: { $nin: excludedSessionIds.map((id) => Number(id)) },
      }),
    });
    sessions.forEach((session) => (session.valid = false));
    return this.em.flush();
  }
}
