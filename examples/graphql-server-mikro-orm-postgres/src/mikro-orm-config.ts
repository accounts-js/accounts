import 'reflect-metadata';
import { User, UserEmail, UserService, UserSession } from '@accounts/mikro-orm';
import { ReflectMetadataProvider } from 'mikro-orm';

export default {
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  entities: [User, UserEmail, UserService, UserSession],
  dbName: 'accounts',
  user: 'postgres',
  password: 'very-secret',
  type: 'postgresql' as 'postgresql',
  forceUtcTimezone: true,
  debug: true,
};
