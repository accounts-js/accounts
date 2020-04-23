import gql from 'graphql-tag';

export const challengeMutation = gql`
  mutation challenge($mfaToken: String!, $authenticatorId: String!) {
    challenge(mfaToken: $mfaToken, authenticatorId: $authenticatorId)
  }
`;
