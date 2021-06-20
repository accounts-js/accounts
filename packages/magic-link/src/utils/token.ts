export const verifyToken = (token?: string, storedToken?: string) => {
  // TODO : Verify expiry here?
  return Boolean(token && storedToken && token == storedToken);
};
