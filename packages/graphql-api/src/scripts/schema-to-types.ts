import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { parse, execute } from 'graphql';
// tslint:disable-next-line
import { introspectionQuery } from 'graphql/utilities';
// tslint:disable-next-line
import { makeExecutableSchema } from 'graphql-tools';

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

// Copy from graphql-js library, will be released in new version
// https://github.com/graphql/graphql-js/blob/master/src/utilities/introspectionFromSchema.js
async function introspectionFromSchema(schemaT: any /* GraphQLSchema */) {
  const queryAST = parse(introspectionQuery);
  const result = await execute(schemaT, queryAST);
  return result.data; /* IntrospectionQuery */
}

const setup = async () => {
  const executableSchema = makeExecutableSchema({
    typeDefs: schema,
  });
  const introspection = await introspectionFromSchema(executableSchema);
  const json = JSON.stringify(introspection, null, 2);
  // Write down the file
  writeFileSync(resolve(__dirname, '../../schema.json'), json);
};

setup();
