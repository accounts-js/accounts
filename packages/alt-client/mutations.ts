import gql from 'graphql-tag';
import localStorage from './storage/localStorage';
import { StorageAdapter } from './storage/interface';

export const AUTHENTICATE = gql`
  mutation authenticate($password: String!, $email: String!) {
    authenticate(
      params: { password: $password, user: { email: $email } }
      serviceName: "password"
    ) {
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

export const AUTHENTICATE_CALLBACK = (storage: StorageAdapter = localStorage) => ({
  data: { authenticate },
}: any) => {
  storage.set('accessToken', authenticate.tokens.accessToken);
  storage.set('refreshToken', authenticate.tokens.refreshToken);
};

export const REFRESH_TOKEN = gql`
  mutation refreshTokens($accessToken: String, $refreshToken: String) {
    refreshTokens(accessToken: $accessToken, refreshToken: $refreshToken) {
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

export const REFRESH_TOKEN_CALLBACK = (storage: StorageAdapter = localStorage) => ({
  data: { refreshTokens },
}: any) => {
  storage.set('accessToken', refreshTokens.tokens.accessToken);
  storage.set('refreshToken', refreshTokens.tokens.refreshToken);
};
