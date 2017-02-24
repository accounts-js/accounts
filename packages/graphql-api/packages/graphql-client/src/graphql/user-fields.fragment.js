import gql from 'graphql-tag';

export const defaultUserFieldsFragment = gql`
  fragment UserFields on User {
    email
    username
  }
`;
