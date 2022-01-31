import { DatabaseInterfaceSessions } from '@accounts/types';
import { InjectionToken } from 'graphql-modules';

export const DatabaseInterfaceSessionsToken = new InjectionToken<DatabaseInterfaceSessions>(
  'DatabaseInterfaceSessions'
);
