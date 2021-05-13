import { createModule, gql } from 'graphql-modules';

export const passwordModule = createModule({
  id: 'accounts-password',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Tokens {
        refreshToken: String
        accessToken: String
      }

      type LoginResult {
        sessionId: String
        tokens: Tokens
        user: String
      }

      type CreateUserResult {
        # Will be returned only if ambiguousErrorMessages is set to false.
        userId: ID
        # Will be returned only if enableAutologin is set to true.
        loginResult: LoginResult
      }

      input CreateUserInput {
        username: String
        email: String
        password: String
      }

      type Mutation {
        # Creates a user with a password, returns the id corresponding db ids, such as number IDs, ObjectIDs or UUIDs
        createUser(user: CreateUserInput!): CreateUserResult
      }
    `,
  ],
  resolvers: {
    Mutation: {
      createUser: () => 'world',
    },
  },
});
