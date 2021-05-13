import { createModule, gql } from 'graphql-modules';
import { User, ConnectionInformations } from '@accounts/types';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';

declare global {
  namespace GraphQLModules {
    interface GlobalContext {
      authToken?: string;
      user?: User;
      userId?: string;
      userAgent: string | null;
      ip: string | null;
      infos: ConnectionInformations;
    }
  }
}

export const coreModule = createModule({
  id: 'accounts-core',
  dirname: __dirname,
  typeDefs: [
    gql`
      directive @auth on FIELD_DEFINITION | OBJECT

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

      type ImpersonateReturn {
        authorized: Boolean
        tokens: Tokens
        user: User
      }

      input UserInput {
        id: ID
        email: String
        username: String
      }

      input AuthenticateParamsInput {
        # Twitter, Instagram
        access_token: String
        # Twitter
        access_token_secret: String
        # OAuth
        provider: String
        # Password
        password: String
        # Password
        user: UserInput
        # Two factor
        code: String
      }

      input ImpersonationUserIdentityInput {
        userId: String
        username: String
        email: String
      }

      type Query {
        getUser: User
      }

      type Mutation {
        impersonate(
          accessToken: String!
          impersonated: ImpersonationUserIdentityInput!
        ): ImpersonateReturn
        refreshTokens(accessToken: String!, refreshToken: String!): LoginResult
        logout: Boolean

        # Example: Login with password
        # authenticate(serviceName: "password", params: {password: "<pw>", user: {email: "<email>"}})
        authenticate(serviceName: String!, params: AuthenticateParamsInput!): LoginResult
        verifyAuthentication(serviceName: String!, params: AuthenticateParamsInput!): Boolean
      }
    `,
  ],
  resolvers: [{ Query }, { Mutation }],
});
