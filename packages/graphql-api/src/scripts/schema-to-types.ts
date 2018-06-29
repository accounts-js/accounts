import { generateNamespace } from '@gql2ts/from-schema';
import * as fs from 'fs';
import * as path from 'path';

import { createJSAccountsGraphQL } from '../schema-builder';

const schemaPath = path.join(__dirname, '../graphql/schema.d.ts');

const typescriptTypes = generateNamespace(
  'GQL',
  createJSAccountsGraphQL(null as any, {
    rootQueryName: 'Query',
    rootMutationName: 'Mutation',
    extend: false,
    withSchemaDefinition: true,
  }).schema
);

fs.writeFile(schemaPath, typescriptTypes, err => {
  if (err) {
    throw err;
  }
});
