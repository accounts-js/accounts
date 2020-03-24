import gql from 'graphql-tag';

export const getUserQuery = (userFieldsFragment: any) => gql`
  ${userFieldsFragment}
  query getUser {
    getUser {
      ...userFields
    }
  }
`;
