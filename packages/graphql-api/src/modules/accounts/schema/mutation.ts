import gql from 'graphql-tag';
import { AccountsModuleConfig } from '..';

export default (config: AccountsModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootMutationName || 'Mutation'} {
    impersonate(accessToken: String!, username: String!): ImpersonateReturn
    refreshTokens(accessToken: String!, refreshToken: String!): LoginResult
    logout: Boolean

    # Example: Login with password
    # authenticate(serviceName: "password", params: {password: "<pw>", user: {email: "<email>"}})
    authenticate(serviceName: String!, params: AuthenticateParamsInput!): LoginResult
    authenticateWithoutSessionCreation(serviceName: String!, params: AuthenticateParamsInput!): Boolean
  }
`;
