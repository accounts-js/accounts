import gql from 'graphql-tag';

export const getAccountsOptionsQuery = gql`
  query {
    getAccountsOptions {
      siteTitle
      siteUrl
      services {
        name
      }
    }
  }
`;
