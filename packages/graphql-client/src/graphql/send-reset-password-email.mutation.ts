import gql from 'graphql-tag';

export const sendResetPasswordEmailMutation = gql`
  mutation sendResetPasswordEmail($email: String!) {
    sendResetPasswordEmail(email: $email)
  }
`;
