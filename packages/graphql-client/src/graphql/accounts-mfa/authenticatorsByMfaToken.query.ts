import gql from 'graphql-tag';

export const authenticatorsByMfaTokenQuery = gql`
  query authenticatorsByMfaToken($mfaToken: String!) {
    authenticatorsByMfaToken(mfaToken: $mfaToken) {
      id
      type
      active
      activatedAt
    }
  }
`;
