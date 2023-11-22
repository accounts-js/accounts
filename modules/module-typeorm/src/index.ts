import { createModule, gql, type Provider } from 'graphql-modules';
import { DatabaseInterfaceSessionsToken, DatabaseInterfaceUserToken } from '@accounts/server';
import {
  AccountsTypeorm,
  UserEmailToken,
  UserSessionToken,
  UserServiceToken,
  UserToken,
  User,
  UserEmail,
  UserSession,
  UserService,
  type AccountsTypeormOptions,
  AccountsTypeORMConfigToken,
} from '@accounts/typeorm';
import { type DatabaseType } from '@accounts/types';
import { Connection } from 'typeorm';

export interface AccountsTypeORMModuleConfig extends AccountsTypeormOptions {
  connection?: Connection;
  // TODO: check if this database adapter can be split into user and sessions
  type?: DatabaseType.Both;
  UserEntity?: typeof User;
  UserEmailEntity?: typeof UserEmail;
  UserSessionEntity?: typeof UserSession;
  UserServiceEntity?: typeof UserService;
}

export const createAccountsTypeORMModule = ({
  connection,
  UserEmailEntity = UserEmail,
  UserSessionEntity = UserSession,
  UserServiceEntity = UserService,
  UserEntity = User,
  ...options
}: AccountsTypeORMModuleConfig = {}) =>
  createModule({
    typeDefs: gql`
      extend type Query {
        _accounts_typeorm: String
      }
    `,
    id: 'accounts-typeorm',
    providers: () => {
      const providers: Provider[] = [
        {
          provide: UserEmailToken,
          useValue: UserEmailEntity,
          global: true,
        },
        {
          provide: UserSessionToken,
          useValue: UserSessionEntity,
          global: true,
        },
        {
          provide: UserServiceToken,
          useValue: UserServiceEntity,
          global: true,
        },
        {
          provide: UserToken,
          useValue: UserEntity,
          global: true,
        },
        {
          provide: DatabaseInterfaceUserToken,
          useClass: AccountsTypeorm,
          global: true,
        },
        {
          provide: DatabaseInterfaceSessionsToken,
          useValue: undefined,
          global: true,
        },
        {
          provide: AccountsTypeORMConfigToken,
          useValue: options,
          global: true,
        },
        {
          provide: Connection,
          useValue: connection,
          global: true,
        },
      ];
      return providers;
    },
  });
