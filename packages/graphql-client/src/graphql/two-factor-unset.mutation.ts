import gql from 'graphql-tag';

export const twoFactorUnsetMutation = gql`
  mutation twoFactorUnset($code: String!) {
    twoFactorUnset(code: $code)
  }
`;
