import 'reflect-metadata';
import { createApplication } from 'graphql-modules';
import {
  createAccountsCoreModule,
  createAccountsMagicLinkModule,
  createAccountsPasswordModule,
} from './modules';
import {
  AuthenticationServicesToken,
  DatabaseInterfaceUserToken,
  DatabaseInterfaceSessionsToken,
} from '@accounts/server';

const { schema } = createApplication({
  modules: [
    createAccountsCoreModule({ tokenSecret: 'my-secret' }),
    createAccountsPasswordModule(),
    createAccountsMagicLinkModule(),
  ],
  providers: [
    {
      provide: DatabaseInterfaceUserToken,
      useValue: {},
    },
    {
      provide: DatabaseInterfaceSessionsToken,
      useValue: {},
    },
    {
      provide: AuthenticationServicesToken,
      useValue: {},
      global: true,
    },
  ],
});

export default schema;
