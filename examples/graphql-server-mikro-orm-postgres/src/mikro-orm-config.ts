import 'reflect-metadata';
import {
  getEmailSchema,
  getServiceSchema,
  getSessionSchema,
  getUserSchema,
} from '@accounts/mikro-orm';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import { User, AccountsUser } from './entities/user';
import { Email } from './entities/email';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export default {
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  entities: [
    User,
    Email,
    getUserSchema({ AccountsUser, EmailEntity: Email, abstract: true }),
    getEmailSchema({ UserEntity: User, abstract: true }),
    getServiceSchema({ UserEntity: User }),
    getSessionSchema({ UserEntity: User }),
  ],
  dbName: 'accounts',
  user: 'postgres',
  password: 'very-secret',
  driver: PostgreSqlDriver,
  forceUtcTimezone: true,
  debug: true,
};
