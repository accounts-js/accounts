import gql from 'graphql-tag';

export const authenticatorsQuery = gql`
  query authenticators($mfaToken: String) {
    authenticators(mfaToken: $mfaToken) {
      id
      type
      active
      activatedAt
    }
  }
`;
