import gql from 'graphql-tag';
import { AccountsModuleConfig } from '..';

export default (config: AccountsModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootMutationName || 'Mutation'} {
    impersonate(accessToken: String!, impersonated: ImpersonationUserIdentityInput!): ImpersonateReturn
    refreshTokens(accessToken: String!, refreshToken: String!): LoginResult
    logout: Boolean

    # Example: Login with password
    # authenticate(serviceName: "password", params: {password: "<pw>", user: {email: "<email>"}})
    authenticate(serviceName: String!, params: AuthenticateParamsInput!): LoginResult
    verifyAuthentication(serviceName: String!, params: AuthenticateParamsInput!): Boolean
  }
`;
