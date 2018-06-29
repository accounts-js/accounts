import gql from 'graphql-tag';

export const changePasswordMutation = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;
