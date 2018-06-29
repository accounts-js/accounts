import gql from 'graphql-tag';

export const refreshTokensMutation = gql`
  mutation refreshTokens($accessToken: String!, $refreshToken: String!) {
    refreshTokens(accessToken: $accessToken, refreshToken: $refreshToken) {
      sessionId
      tokens {
        refreshToken
        accessToken
      }
    }
  }
`;
