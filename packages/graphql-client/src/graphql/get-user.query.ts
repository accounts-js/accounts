import gql from 'graphql-tag';

export const getUserQuery = gql`
  query {
    getUser {
      id
      emails {
        address
        verified
      }
      username
    }
  }
`;
