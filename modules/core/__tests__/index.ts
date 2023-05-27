import { print } from 'graphql';
import { createApplication } from 'graphql-modules';
import { createAccountsCoreModule } from '../src';
import { mergeTypeDefs } from '@graphql-tools/merge';

const accountsServer = {
  getServices: () => ({
    password: {},
    magicLink: {},
  }),
};

describe('AccountsModule', () => {
  it('should export typeDefs with schema definition', () => {
    const accountsGraphQL = createApplication({
      modules: [createAccountsCoreModule({ accountsServer } as any)],
    });
    expect(print(mergeTypeDefs(accountsGraphQL.typeDefs))).toMatch(/schema/);
  });
});
