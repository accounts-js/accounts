import { createModule, gql } from 'graphql-modules';

export const coreModule = createModule({
  id: 'accounts-core',
  dirname: __dirname,
  typeDefs: [
    gql`
      # TODO See how to inject userAsInterface option
      type User {
        id: ID!
        emails: [EmailRecord!]
        username: String
      }

      type EmailRecord {
        address: String
        verified: Boolean
      }

      type Tokens {
        refreshToken: String
        accessToken: String
      }

      type LoginResult {
        sessionId: String
        tokens: Tokens
        user: User
      }

      type Query {
        getUser: User
      }
    `,
  ],
  resolvers: {
    Query: {
      getUser: () => 'world',
    },
  },
});
