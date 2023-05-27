import 'reflect-metadata';
import { createApplication } from 'graphql-modules';
import { createAccountsCoreModule } from '@accounts/module-core';
import {
  AuthenticationServicesToken,
  DatabaseInterfaceUserToken,
  DatabaseInterfaceSessionsToken,
} from '@accounts/server';
import { createAccountsMagicLinkModule } from '.';

const { schema } = createApplication({
  modules: [
    createAccountsCoreModule({ tokenSecret: 'my-secret' }),
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
