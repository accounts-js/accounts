import gql from 'graphql-tag';

export const verifyEmailMutation = gql`
  mutation verifyEmail($token: String!) {
    verifyEmail(token: $token)
  }
`;
