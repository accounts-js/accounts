export const JSAccountsContext = (request, headerName = 'Authorization') => {
  return {
    authToken: request.headers[headerName] || request.headers[headerName.toLowerCase()],
  };
};
