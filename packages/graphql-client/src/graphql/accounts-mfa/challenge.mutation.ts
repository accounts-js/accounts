import gql from 'graphql-tag';

export const challengeMutation = (challengeFieldsFragment?: any) => gql`
  mutation challenge($mfaToken: String!, $authenticatorId: String!) {
    challenge(mfaToken: $mfaToken, authenticatorId: $authenticatorId) ${
      challengeFieldsFragment || ''
    }
  }
`;
