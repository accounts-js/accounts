import gql from 'graphql-tag';

export const addEmailMutation = gql`
  mutation addEmail($newEmail: String!) {
    addEmail(newEmail: $newEmail)
  }
`;
