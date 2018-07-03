import gql from 'graphql-tag';

export const sendVerificationEmailMutation = gql`
  mutation sendVerificationEmail($email: String!) {
    sendVerificationEmail(email: $email)
  }
`;
