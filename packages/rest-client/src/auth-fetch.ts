import { AccountsClient } from '@accounts/client';

const headers: { [key: string]: string } = {
  'Content-Type': 'application/json',
};

export const authFetch = async (accounts: AccountsClient, path: string, request: any) => {
  const tokens = await accounts.refreshSession();
  let headersCopy = { ...headers };

  if (tokens) {
    headersCopy.Authorization = 'Bearer ' + tokens.accessToken;
  }

  if (request['headers']) {
    headersCopy = {
      ...headersCopy,
      ...request['headers'],
    };
  }

  const fetchOptions = {
    ...request,
    headers: headersCopy,
  };
  return fetch(path, fetchOptions);
};
