import jwtDecode from 'jwt-decode';
import { isTokenExpired } from '../src/utils';

jest.mock('jwt-decode');

describe('utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isTokenExpired', () => {
    it('return true if token is expired', () => {
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({
        exp: 1,
      }));
      const res = isTokenExpired('token');
      expect(res).toBeTruthy();
      expect(jwtDecode).toHaveBeenCalledWith('token');
    });
  });
});
