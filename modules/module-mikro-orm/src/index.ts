import { createModule, gql, Provider, Scope } from 'graphql-modules';
import { DatabaseInterfaceSessionsToken, DatabaseInterfaceUserToken } from '@accounts/server';
import {
  AccountsMikroOrm,
  Email,
  Session,
  Service,
  EmailToken,
  IUser,
  SessionToken,
  ServiceToken,
  UserToken,
} from '@accounts/mikro-orm';
import { Connection, Constructor, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { DatabaseType } from '@accounts/types';

export * from './types';
export * from './utils';

export interface AccountsMikroORMModuleConfig<
  CustomUser extends IUser<CustomEmail, CustomSession, CustomService>,
  CustomEmail extends Email<CustomUser>,
  CustomSession extends Session<CustomUser>,
  CustomService extends Service<CustomUser>,
> {
  em?: EntityManager<IDatabaseDriver<Connection>>;
  // At the moment this database adapter cannot be split into user and sessions
  type?: DatabaseType.Both;
  UserEntity?: Constructor<CustomUser | IUser<CustomEmail, CustomSession, CustomService>>;
  EmailEntity?: Constructor<CustomEmail | Email<CustomUser>>;
  SessionEntity?: Constructor<CustomSession | Session<CustomUser>>;
  ServiceEntity?: Constructor<CustomService | Service<CustomUser>>;
}

export const createAccountsMikroORMModule = <
  CustomUser extends IUser<CustomEmail, CustomSession, CustomService>,
  CustomEmail extends Email<CustomUser>,
  CustomSession extends Session<CustomUser>,
  CustomService extends Service<CustomUser>,
>({
  em,
  EmailEntity,
  SessionEntity,
  ServiceEntity,
  UserEntity,
}: AccountsMikroORMModuleConfig<CustomUser, CustomEmail, CustomSession, CustomService> = {}) =>
  createModule({
    typeDefs: gql`
      extend type Query {
        _accounts_mikro_orm: String
      }
    `,
    id: 'accounts-mikro-orm',
    providers: () => {
      const providers: Provider[] = [
        {
          provide: EmailToken,
          useValue: EmailEntity,
          global: true,
        },
        {
          provide: SessionToken,
          useValue: SessionEntity,
          global: true,
        },
        {
          provide: ServiceToken,
          useValue: ServiceEntity,
          global: true,
        },
        {
          provide: UserToken,
          useValue: UserEntity,
          global: true,
        },
        {
          provide: DatabaseInterfaceUserToken,
          useClass: AccountsMikroOrm,
          global: true,
        },
        {
          provide: DatabaseInterfaceSessionsToken,
          useValue: undefined,
          global: true,
        },
      ];
      if (em) {
        providers.push({
          provide: EntityManager,
          scope: Scope.Operation,
          useFactory: () => em.fork(),
          global: true,
        });
      }
      return providers;
    },
  });
