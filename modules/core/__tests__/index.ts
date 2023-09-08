import 'reflect-metadata';
import { print } from 'graphql';
import { createApplication } from 'graphql-modules';
import { createAccountsCoreModule } from '../src';
import { mergeTypeDefs } from '@graphql-tools/merge';
import {
  AuthenticationServicesToken,
  DatabaseInterfaceSessionsToken,
  DatabaseInterfaceUserToken,
} from '@accounts/server';

describe('AccountsModule', () => {
  it('should export typeDefs with schema definition', () => {
    const accountsGraphQL = createApplication({
      modules: [createAccountsCoreModule({ tokenSecret: 'random' })],
      providers: [
        {
          provide: AuthenticationServicesToken,
          useValue: {
            password: {
              setUserStore: () => null,
              setSessionsStore: () => null,
            },
          },
          global: true,
        },
        {
          provide: DatabaseInterfaceUserToken,
          useValue: {},
          global: true,
        },
        {
          provide: DatabaseInterfaceSessionsToken,
          useValue: undefined,
          global: true,
        },
      ],
    });
    expect(print(mergeTypeDefs(accountsGraphQL.typeDefs))).toMatch(/schema/);
  });
});
