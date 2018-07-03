import { generateNamespace } from '@gql2ts/from-schema';
import * as fs from 'fs';
import * as path from 'path';

import { mutations } from '../graphql/mutations';
import { typeDefs } from '../graphql/types';
import { queries } from '../graphql/queries';

const schema = `
  type Query {
    ${queries}
  }

  type Mutation {
    ${mutations}
  }

  ${typeDefs}

  schema {
    query: Query
    mutation: Mutation
  }
`;

const typescriptTypes = generateNamespace('GQL', schema);

const schemaPath = path.join(__dirname, '../graphql/schema.d.ts');

fs.writeFile(schemaPath, typescriptTypes, err => {
  if (err) {
    throw err;
  }
});
