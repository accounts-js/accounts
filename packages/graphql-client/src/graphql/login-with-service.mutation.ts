import gql from 'graphql-tag';

export const loginWithServiceMutation = gql`
  mutation($serviceName: String!, $params: AuthenticateParamsInput!) {
    authenticate(serviceName: $serviceName, params: $params) {
      __typename
      ... on LoginResult {
        sessionId
        tokens {
          refreshToken
          accessToken
        }
      }
      ... on MFALoginResult {
        mfaToken
        challenges
      }
    }
  }
`;
