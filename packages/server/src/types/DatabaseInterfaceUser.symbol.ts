import { type DatabaseInterfaceUser } from '@accounts/types';
import { InjectionToken } from 'graphql-modules';

export const DatabaseInterfaceUserToken = new InjectionToken<DatabaseInterfaceUser>(
  'DatabaseInterfaceUser'
);
