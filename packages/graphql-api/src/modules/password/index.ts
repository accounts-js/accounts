import { createModule, gql } from 'graphql-modules';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';

export const passwordModule = createModule({
  id: 'accounts-password',
  dirname: __dirname,
  typeDefs: [
    gql`
      type CreateUserResult {
        # Will be returned only if ambiguousErrorMessages is set to false.
        userId: ID
        # Will be returned only if enableAutologin is set to true.
        loginResult: LoginResult
      }

      type TwoFactorSecretKey {
        ascii: String
        base32: String
        hex: String
        qr_code_ascii: String
        qr_code_hex: String
        qr_code_base32: String
        google_auth_qr: String
        otpauth_url: String
      }

      input TwoFactorSecretKeyInput {
        ascii: String
        base32: String
        hex: String
        qr_code_ascii: String
        qr_code_hex: String
        qr_code_base32: String
        google_auth_qr: String
        otpauth_url: String
      }

      input CreateUserInput {
        username: String
        email: String
        password: String
      }

      extend type Query {
        twoFactorSecret: TwoFactorSecretKey
      }

      extend type Mutation {
        # Creates a user with a password, returns the id corresponding db ids, such as number IDs, ObjectIDs or UUIDs
        createUser(user: CreateUserInput!): CreateUserResult
        verifyEmail(token: String!): Boolean
        resetPassword(token: String!, newPassword: String!): LoginResult
        sendVerificationEmail(email: String!): Boolean
        sendResetPasswordEmail(email: String!): Boolean
        addEmail(newEmail: String!): Boolean
        changePassword(oldPassword: String!, newPassword: String!): Boolean
        twoFactorSet(secret: TwoFactorSecretKeyInput!, code: String!): Boolean
        twoFactorUnset(code: String!): Boolean
      }
    `,
  ],
  resolvers: [{ Query }, { Mutation }],
});
