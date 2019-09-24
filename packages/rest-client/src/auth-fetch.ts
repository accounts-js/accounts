import { forIn } from 'lodash';
import { AccountsClient } from '@accounts/client';

const headers: { [key: string]: string } = {
  'Content-Type': 'application/json',
};

export const authFetch = async (accounts: AccountsClient, path: string, request: any) => {
  const tokens = await accounts.refreshSession();
  const headersCopy = { ...headers };

  if (tokens) {
    headersCopy.Authorization = 'Bearer ' + tokens.accessToken;
  }

  if (request['headers']) {
    forIn(request['headers'], (v: string, k: string) => {
      headersCopy[v] = k;
    });
  }

  const fetchOptions = {
    ...request,
    headers: headersCopy,
  };
  return fetch(path, fetchOptions);
};
