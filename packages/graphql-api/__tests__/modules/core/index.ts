import { DocumentNode, print } from 'graphql';
import { gql, testkit } from 'graphql-modules';
import { coreModule } from '../../../src/modules';

const accountsServer = {
  getServices: () => ({
    password: {},
  }),
};

describe('CoreModule', () => {
  describe('withSchemaDefinition', () => {
    it('should export typeDefs with schema definition', () => {
      const app = testkit.testModule(
          coreModule({
            accountsServer: accountsServer as any,
            withSchemaDefinition: true,
          })
      );
      expect(printTypeDefs(app.typeDefs)).toMatch(/schema/);
    });

    it('should export typeDefs without schema definition', () => {
      const app = testkit.testModule(
          coreModule({
            accountsServer: accountsServer as any,
            withSchemaDefinition: false,
          })
      );
      expect(printTypeDefs(app.typeDefs)).not.toMatch(/schema/);
    });
  });

  describe('extendTypeDefs', () => {
    it('should extends typeDefs', () => {
      const app = testkit.testModule(
          coreModule({
            accountsServer: accountsServer as any,
            extendTypeDefs: true,
          }), {
            typeDefs: gql`
              type Query {
                _empty: String
              }
              
              type Mutation {
                _empty: String
              }
            `
          }
      );
      expect(printTypeDefs(app.typeDefs)).toMatch(/extend/);
    });

    it('should not extends typeDefs', () => {
      const app = testkit.testModule(
          coreModule({
            accountsServer: accountsServer as any,
            extendTypeDefs: false,
          })
      );
      expect(printTypeDefs(app.typeDefs)).not.toMatch(/extend/);
    });
  });
});

function printTypeDefs(typeDefs: DocumentNode[]): string {
  let typeDefsString = '';
  typeDefs.forEach(typeDef => typeDefsString += print(typeDef));
  return typeDefsString;
}

