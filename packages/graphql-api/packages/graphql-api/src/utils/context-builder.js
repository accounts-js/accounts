export const JSAccountsContext =
  (request, headerName = 'Authorization') => ({
    authToken: request.headers[headerName] || request.headers[headerName.toLowerCase()],
  });
