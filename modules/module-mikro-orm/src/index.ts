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
  CustomUser extends IUser<any, any, any>,
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>,
> {
  em?: EntityManager<IDatabaseDriver<Connection>>;
  // At the moment this database adapter cannot be split into user and sessions
  type?: DatabaseType.Both;
  UserEntity?: Constructor<CustomUser | IUser<any, any, any>>;
  EmailEntity?: Constructor<CustomEmail | Email<any>>;
  SessionEntity?: Constructor<CustomSession | Session<any>>;
  ServiceEntity?: Constructor<CustomService | Service<any>>;
}

export const createAccountsMikroORMModule = <
  CustomUser extends IUser<any, any, any>,
  CustomEmail extends Email<any>,
  CustomSession extends Session<any>,
  CustomService extends Service<any>,
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
