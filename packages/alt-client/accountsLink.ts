import { ApolloLink } from 'apollo-link';
import * as jwtDecode from 'jwt-decode';
import localStorage from './storage/localStorage';
import { StorageAdapter } from './storage/interface';

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

const accountsLink = (storage: StorageAdapter = localStorage, client: ApolloClient<any>) =>
  new ApolloLink((operation, forward) => {
    const accessToken = storage.get('accessToken');
    const resumeToken = storage.get('resumeToken');
    if (accessToken) {
      if (isTokenExpired(accessToken)) {
        if (resumeToken && !isTokenExpired(resumeToken)) {
          client.mutate()
        } else {
          storage.remove('accessToken');
          storage.remove('resumeToken');
        }
      }
      operation.setContext(() => ({
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }));
    }
    return forward ? forward(operation) : null;
  });

export default accountsLink;
