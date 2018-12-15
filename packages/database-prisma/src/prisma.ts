// tslint:disable variable-name _id
import {
  ConnectionInformations,
  CreateUser,
  DatabaseInterface,
  Session,
  User,
} from '@accounts/types';
import { GraphQLClient, Options } from 'graphql-request';

const defaultOptions = {
  caseSensitiveUserName: true,
};

const gql = (s: any) => {
  return String(s).replace(`\n`, ` `);
};

export interface PrismaOptions extends Options {
  caseSensitiveUserName: boolean;
}

export class Prisma implements DatabaseInterface {
  private options: PrismaOptions & typeof defaultOptions;
  private client: GraphQLClient;

  constructor(url: string, options?: PrismaOptions) {
    this.options = { ...defaultOptions, ...options };
    // const graphqlClientOptions: any = { ...options };
    // delete graphqlClientOptions.caseSensitiveUserName;
    this.client = new GraphQLClient(url, this.options as Options);
  }

  public async createUser({
    password,
    username,
    email,
    ...cleanUser
  }: CreateUser): Promise<string> {
    const data = {
      data: {
        emails: !email
          ? undefined
          : {
              create: {
                address: email.toLowerCase(),
              },
            },
        services: !password
          ? undefined
          : {
              create: {
                password: {
                  create: {
                    bcrypt: password,
                  },
                },
              },
            },
        username,
      },
    };

    const createUserMutation: any = await this.client.request(
      gql`
        mutation CreateUser($data: CreateAccountsUserInput!) {
          createUser(data: $data) {
            id
          }
        }
      `,
      { data }
    );

    return createUserMutation.createUser.id;
  }

  public findSessionByToken(token: string): Promise<Session | null> {
    throw new Error('Method not implemented.');
  }

  public async findUserById(userId: string): Promise<User | null> {
    return null;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return null;
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    // $where: `obj.username && (obj.username.toLowerCase() === "${username.toLowerCase()}")`,
    return null;
  }

  public async findPasswordHash(userId: string): Promise<string | null> {
    return null;
  }

  public async findUserByEmailVerificationToken(token: string): Promise<User | null> {
    return null;
  }

  public async findUserByResetPasswordToken(token: string): Promise<User | null> {
    return null;
  }

  public async findUserByServiceId(serviceName: string, serviceId: string): Promise<User | null> {
    return null;
  }

  public async addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    //
  }

  public async removeEmail(userId: string, email: string): Promise<void> {
    //
  }

  public async verifyEmail(userId: string, email: string): Promise<void> {
    // $pull: { 'services.email.verificationTokens': { address: email } },
  }

  public async setUsername(userId: string, newUsername: string): Promise<void> {
    //
  }

  public async setPassword(userId: string, newPassword: string): Promise<void> {
    // {
    //   $set: {
    //     'services.password.bcrypt': newPassword,
    //     [this.options.timestamps.updatedAt]: this.options.dateProvider(),
    //   },
    //   $unset: {
    //     'services.password.reset': '',
    //   },
  }

  public async setProfile(userId: string, profile: object): Promise<object> {
    throw new Error('profiles are not supported');
  }

  public async setService(userId: string, serviceName: string, service: object): Promise<void> {
    //
  }

  public async unsetService(userId: string, serviceName: string): Promise<void> {
    //
  }

  public async setUserDeactivated(userId: string, deactivated: boolean): Promise<void> {
    //
  }

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
      // extraData,
      valid: true,
    };

    return '';
  }

  public async updateSession(sessionId: string, connection: ConnectionInformations): Promise<void> {
    //
  }

  public async invalidateSession(sessionId: string): Promise<void> {
    //
  }

  public async invalidateAllSessions(userId: string): Promise<void> {
    //
  }

  public async findSessionById(sessionId: string): Promise<Session | null> {
    return null;
  }

  public async addEmailVerificationToken(
    userId: string,
    email: string,
    token: string
  ): Promise<void> {
    //
  }

  public async addResetPasswordToken(
    userId: string,
    email: string,
    token: string,
    reason: string
  ): Promise<void> {
    //
  }

  public async setResetPassword(userId: string, email: string, newPassword: string): Promise<void> {
    await this.setPassword(userId, newPassword);
  }
}
