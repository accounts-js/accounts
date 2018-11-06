import gql from 'graphql-tag';
import { IAccountsPasswordModuleConfig } from '..';

export default (config: IAccountsPasswordModuleConfig) => gql`
  ${config.extendTypeDefs ? 'extend' : ''} type ${config.rootMutationName || 'Mutation'} {
    # Creates a user with a password, returns the id corresponding db ids, such as number IDs, ObjectIDs or UUIDs
    createUser(user: CreateUserInput!): ID
    verifyEmail(token: String!): Boolean
    resetPassword(token: String!, newPassword: String!): Boolean
    sendVerificationEmail(email: String!): Boolean
    sendResetPasswordEmail(email: String!): Boolean
    changePassword(oldPassword: String!, newPassword: String!): Boolean
    twoFactorSet(secret: TwoFactorSecretKeyInput!, code: String!): Boolean
    twoFactorUnset(code: String!): Boolean
  }
`;
