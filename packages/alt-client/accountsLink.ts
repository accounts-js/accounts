import { ApolloLink } from 'apollo-link';
import jwtDecode from 'jwt-decode';
import { ApolloClient } from 'apollo-client';
import localStorage from './storage/localStorage';
import { StorageAdapter } from './storage/interface';
import { REFRESH_TOKEN, REFRESH_TOKEN_CALLBACK } from './mutations';

interface JwtDecodeData {
  exp: number;
  iat: number;
}
// take from aaccounts/client/utils
export const isTokenExpired = (token: string): boolean => {
  const currentTime = Date.now() / 1000;
  const decodedToken = jwtDecode<JwtDecodeData>(token);
  return decodedToken.exp < currentTime;
};

const accountsLink = (client: ApolloClient<any>, storage: StorageAdapter = localStorage) =>
  new ApolloLink((operation, forward) => {
    operation.setContext(async () => {
      const accessToken = await storage.get('accessToken');
      const refreshToken = await storage.get('refreshToken');
      if (accessToken) {
        if (isTokenExpired(accessToken)) {
          if (refreshToken && !isTokenExpired(refreshToken)) {
            await client
              .mutate({
                mutation: REFRESH_TOKEN,
                variables: { accessToken, refreshToken },
              })
              .then(REFRESH_TOKEN_CALLBACK());
          } else {
            await storage.remove('accessToken');
            await storage.remove('refreshToken');
            return;
          }
        }
      }
      return {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      };
    });

    return forward ? forward(operation) : null;
  });

export default accountsLink;
