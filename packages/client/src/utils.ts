import jwtDecode from 'jwt-decode';

interface JwtDecodeData {
  exp: number;
  iat: number;
}

export const isTokenExpired = (token: string): boolean => {
  const currentTime = Date.now() / 1000;
  const decodedToken = jwtDecode<JwtDecodeData>(token);
  return decodedToken.exp < currentTime;
};
