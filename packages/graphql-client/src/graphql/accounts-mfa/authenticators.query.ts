import gql from 'graphql-tag';

export const authenticatorsQuery = gql`
  query authenticators() {
    authenticators() {
      id
      type
      active
      activatedAt
    }
  }
`;
