import gql from 'graphql-tag';

export const performMfaChallengeMutation = gql`
  mutation($challenge: String!, $mfaToken: String!, $params: AuthenticateParamsInput!) {
    performMfaChallenge(challenge: $challenge, mfaToken: $mfaToken, params: $params)
  }
`;
