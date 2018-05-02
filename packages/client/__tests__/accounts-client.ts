import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { isTokenExpired } from '../src/utils';
import { TransportInterface } from '../src';
import { AccountsClient } from '../src/accounts-client';
import { ENGINE_METHOD_PKEY_METHS } from 'constants';

jest.mock('../src/utils');

const loggedInResponse = {
  sessionId: '1',
  tokens: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  },
};

const impersonateResult = {
  authorized: true,
  tokens: { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' },
};

const tokens = {
  accessToken: 'accessTokenTest',
  refreshToken: 'refreshTokenTest',
};

const mockTransport: TransportInterface = {
  loginWithService: jest.fn(() => Promise.resolve(loggedInResponse)),
  logout: jest.fn(() => Promise.resolve()),
  refreshTokens: jest.fn(() => Promise.resolve(loggedInResponse)),
  sendResetPasswordEmail: jest.fn(() => Promise.resolve()),
  verifyEmail: jest.fn(() => Promise.resolve()),
  sendVerificationEmail: jest.fn(() => Promise.resolve()),
  impersonate: jest.fn(() => Promise.resolve(impersonateResult)),
};

describe('Accounts', () => {
  const accountsClient = new AccountsClient({}, mockTransport);

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('requires a transport', async () => {
    try {
      // tslint:disable-next-line no-unused-expression
      new AccountsClient(null as any, null as any);
      throw new Error();
    } catch (err) {
      const { message } = err;
      expect(message).toEqual('A valid transport is required');
    }
  });

  describe('getTokens', () => {
    it('should return null when no tokens', async () => {
      const result = await accountsClient.getTokens();
      expect(result).toBe(null);
      expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    });

    it('should return the tokens', async () => {
      await accountsClient.setTokens(tokens);
      const result = await accountsClient.getTokens();
      expect(tokens).toEqual(result);
      expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    });

    it('should return the original tokens', async () => {
      await accountsClient.setTokens(tokens, true);
      const result = await accountsClient.getTokens(true);
      expect(tokens).toEqual(result);
      expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('setTokens', () => {
    it('should set the tokens', async () => {
      await accountsClient.setTokens(tokens);
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.getItem('accounts:accessToken')).toEqual(tokens.accessToken);
      expect(localStorage.getItem('accounts:refreshToken')).toEqual(tokens.refreshToken);
    });

    it('should set the oiriginal tokens', async () => {
      await accountsClient.setTokens(tokens, true);
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.getItem('accounts:originalAccessToken')).toEqual(tokens.accessToken);
      expect(localStorage.getItem('accounts:originalRefreshToken')).toEqual(tokens.refreshToken);
    });
  });

  describe('clearTokens', () => {
    it('should clear the tokens', async () => {
      await accountsClient.setTokens(tokens);
      await accountsClient.clearTokens();
      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
      expect(localStorage.getItem('accounts:accessToken')).toEqual(null);
      expect(localStorage.getItem('accounts:refreshToken')).toEqual(null);
    });

    it('should clear the oiriginal tokens', async () => {
      await accountsClient.setTokens(tokens, true);
      await accountsClient.clearTokens(true);
      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
      expect(localStorage.getItem('accounts:originalAccessToken')).toEqual(null);
      expect(localStorage.getItem('accounts:originalRefreshToken')).toEqual(null);
    });
  });

  describe('logout', () => {
    it('should clear the tokens', async () => {
      await accountsClient.logout();
      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
      expect(localStorage.getItem('accounts:accessToken')).toEqual(null);
      expect(localStorage.getItem('accounts:refreshToken')).toEqual(null);
    });

    it('should logout and clear the tokens', async () => {
      await accountsClient.setTokens(tokens);
      await accountsClient.logout();
      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
      expect(localStorage.getItem('accounts:accessToken')).toEqual(null);
      expect(localStorage.getItem('accounts:refreshToken')).toEqual(null);
      expect(mockTransport.logout).toHaveBeenCalled();
    });
  });

  describe('loginWithService', () => {
    it('calls transport', async () => {
      await accountsClient.loginWithService('password', {
        username: 'user',
        password: 'password',
      });
      expect(mockTransport.loginWithService).toHaveBeenCalledTimes(1);
      expect(mockTransport.loginWithService).toHaveBeenCalledWith('password', {
        username: 'user',
        password: 'password',
      });
    });

    it('set the tokens', async () => {
      await accountsClient.loginWithService('password', {
        username: 'user',
        password: 'password',
      });
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.getItem('accounts:accessToken')).toEqual(
        loggedInResponse.tokens.accessToken
      );
      expect(localStorage.getItem('accounts:refreshToken')).toEqual(
        loggedInResponse.tokens.refreshToken
      );
    });
  });

  describe('refreshSession', () => {
    it('should do nothing when no tokens', async () => {
      const result = await accountsClient.refreshSession();
      expect(result).not.toBeTruthy();
      expect(isTokenExpired).not.toHaveBeenCalled();
    });

    it('should call transport.refreshTokens if accessToken is expired and set the tokens', async () => {
      (isTokenExpired as jest.Mock).mockImplementation(() => true);
      await accountsClient.setTokens(tokens);
      const result = await accountsClient.refreshSession();
      expect(result).toEqual(loggedInResponse.tokens);
      expect(isTokenExpired).toHaveBeenCalledWith(tokens.accessToken);
      expect(mockTransport.refreshTokens).toHaveBeenCalledWith(
        tokens.accessToken,
        tokens.refreshToken
      );
      expect(localStorage.setItem).toHaveBeenCalledTimes(4);
    });

    it('should do nothing if tokens are still valid', async () => {
      (isTokenExpired as jest.Mock).mockImplementation(() => false);
      await accountsClient.setTokens(tokens);
      const result = await accountsClient.refreshSession();
      expect(result).toEqual(tokens);
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(mockTransport.refreshTokens).not.toHaveBeenCalledWith();
    });

    it('should clear the tokens is refreshToken is expired', async () => {
      (isTokenExpired as jest.Mock).mockImplementationOnce(() => false);
      (isTokenExpired as jest.Mock).mockImplementationOnce(() => true);
      await accountsClient.setTokens(tokens);
      const result = await accountsClient.refreshSession();
      expect(result).toBe(null);
      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
      expect(mockTransport.refreshTokens).not.toHaveBeenCalledWith();
    });

    it('should clear the tokens and forward the error', async () => {
      try {
        (isTokenExpired as jest.Mock).mockImplementation(() => {
          throw new Error('Err');
        });
        await accountsClient.setTokens(tokens);
        await accountsClient.refreshSession();
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('Err');
        expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
        expect(mockTransport.refreshTokens).not.toHaveBeenCalledWith();
      }
    });
  });

  describe('impersonate', () => {
    it('should throw error if no tokens', async () => {
      try {
        await accountsClient.impersonate({ userId: 'test' });
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('An access token is required');
      }
    });

    it('should throw if server return unauthorized', async () => {
      (mockTransport.impersonate as jest.Mock).mockImplementationOnce(() => Promise.resolve({ authorized: false }))
      try {
        await accountsClient.setTokens(tokens);
        await accountsClient.impersonate({ userId: 'test' });
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('User unauthorized to impersonate');
      }
    });

    it('should set tokens correctly if impersonation was authorized', async () => {
      await accountsClient.setTokens(tokens);
      await accountsClient.impersonate({ userId: 'test' });
      const userTokens = await accountsClient.getTokens();
      const originalTokens = await accountsClient.getTokens(true);
      expect(userTokens).toEqual(impersonateResult.tokens);
      expect(originalTokens).toEqual(tokens);
    });
  });

  // describe('stopImpersonation', () => {
  //   it('should not replace tokens if not impersonating', async () => {
  //     await Accounts.config({ history }, mockTransport);

  //     await Accounts.loginWithService('password', {
  //       username: 'user',
  //       password: 'password',
  //     });

  //     expect(Accounts.originalTokens()).toEqual({
  //       accessToken: null,
  //       refreshToken: null,
  //     });
  //     expect(Accounts.tokens()).toEqual(loggedInUser.tokens);
  //     await Accounts.stopImpersonation();
  //     expect(Accounts.originalTokens()).toEqual({
  //       accessToken: null,
  //       refreshToken: null,
  //     });
  //     expect(Accounts.tokens()).toEqual(loggedInUser.tokens);
  //   });

  //   it('should set impersonated state to false', async () => {
  //     await Accounts.instance.storeTokens({ accessToken: '1' });
  //     await Accounts.config({ history }, mockTransport);
  //     Accounts.instance.refreshSession = () => Promise.resolve();

  //     await Accounts.impersonate('impUser');
  //     expect(Accounts.isImpersonated()).toBe(true);
  //     await Accounts.stopImpersonation();
  //     expect(Accounts.isImpersonated()).toBe(false);
  //   });

  //   it('should set the original tokens as current tokens and delete original tokens', async () => {
  //     await Accounts.config({ history }, mockTransport);
  //     Accounts.instance.refreshSession = () => Promise.resolve();

  //     await Accounts.loginWithService('password', {
  //       username: 'user',
  //       password: 'password',
  //     });
  //     const tokens = Accounts.tokens();

  //     await Accounts.impersonate('impUser');
  //     expect(Accounts.tokens()).toEqual({
  //       accessToken: 'newAccessToken',
  //       refreshToken: 'newRefreshToken',
  //     });
  //     await Accounts.stopImpersonation();
  //     expect(Accounts.tokens()).toEqual(tokens);
  //     expect(Accounts.originalTokens()).toEqual({
  //       accessToken: null,
  //       refreshToken: null,
  //     });
  //   });
  // });
});
