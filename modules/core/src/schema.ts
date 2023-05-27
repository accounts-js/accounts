import 'reflect-metadata';
import { createApplication } from 'graphql-modules';
import { createAccountsCoreModule } from '.';
import {
  AuthenticationServicesToken,
  DatabaseInterfaceUserToken,
  DatabaseInterfaceSessionsToken,
} from '@accounts/server';

const { schema } = createApplication({
  modules: [createAccountsCoreModule({ tokenSecret: 'my-secret' })],
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
