import { forIn } from 'lodash';
import { AccountsClient } from '@accounts/client';

const headers: { [key: string]: string } = {
  'Content-Type': 'application/json',
};

export const authFetch = async (
  accounts: AccountsClient,
  path: string,
  request: any
) => {
  await accounts.refreshSession();
  const { accessToken } = await accounts.tokens();
  const headersCopy = { ...headers };

  if (accessToken) {
    headersCopy['accounts-access-token'] = accessToken;
  }

  /* tslint:disable no-string-literal */
  if (request['headers']) {
    forIn(request['headers'], (v: string, k: string) => {
      headersCopy[v] = k;
    });
  }
  /* tslint:enable no-string-literal */

  const fetchOptions = {
    ...request,
    headers: headersCopy,
  };
  return fetch(path, fetchOptions);
};
