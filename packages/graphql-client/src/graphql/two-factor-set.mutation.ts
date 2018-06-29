import gql from 'graphql-tag';

export const twoFactorSetMutation = gql`
  mutation twoFactorSet($secret: TwoFactorSecretKeyInput!, $code: String!) {
    twoFactorSet(secret: $secret, code: $code)
  }
`;
