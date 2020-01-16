import { Repository, getRepository } from 'typeorm';
import { DatabaseInterfaceSessions, ConnectionInformations, Session } from '@accounts/types';
import { AccountsTypeormOptions } from './types';
import { defaultOptions } from './options';
import { UserSession } from './entity/UserSession';

export class TypeormSessions implements DatabaseInterfaceSessions {
  private options: AccountsTypeormOptions & typeof defaultOptions;
  private sessionRepository: Repository<UserSession> = null as any;

  constructor(options?: AccountsTypeormOptions) {
    this.options = { ...defaultOptions, ...options };

    const { connection, connectionName, userSessionEntity } = this.options;

    const setRepositories = () => {
      if (connection) {
        this.sessionRepository = connection.getRepository(userSessionEntity);
      } else {
        this.sessionRepository = getRepository(userSessionEntity, connectionName);
      }
    };

    // direct or lazy support
    if (connection && !connection.isConnected) {
      connection.connect().then(setRepositories);
    } else {
      setRepositories();
    }
  }

  public async findSessionById(sessionId: string): Promise<UserSession | null> {
    try {
      const session = await this.sessionRepository.findOne(sessionId, {
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
    const session = await this.sessionRepository.findOne(
      { token },
      {
        cache: this.options.cache,
      }
    );
    if (!session) {
      return null;
    }
    return session;
  }

  public async createSession(
    userId: string,
    token: string,
    connection: ConnectionInformations = {},
    extra?: object
  ) {
    const user = await this.findUserById(userId);
    const session = new this.options.userSessionEntity();
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

  public async invalidateAllSessions(userId: string): Promise<void> {
    await this.sessionRepository.update(
      {
        userId,
      },
      {
        valid: false,
      }
    );
  }
}
