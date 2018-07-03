import gql from 'graphql-tag';

export const getUserQuery = gql`
  query($accessToken: String!) {
    getUser(accessToken: $accessToken) {
      id
      emails {
        address
        verified
      }
      username
    }
  }
`;
