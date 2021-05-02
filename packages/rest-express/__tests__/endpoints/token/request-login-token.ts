import { RequestLoginTokenErrors } from '@accounts/token';
import { AccountsJsError } from '@accounts/server';
import { requestLoginToken } from '../../../src/endpoints/token/request-login-token';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('verifyEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestLoginToken', () => {
    it('calls token.requestLoginToken and returns a message', async () => {
      const tokenService = {
        requestLoginToken: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          token: tokenService,
        }),
      };
      const middleware = requestLoginToken(accountsServer as any);

      const req = {
        body: {
          email: 'email',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().token.requestLoginToken).toHaveBeenCalledWith('email');
      expect(res.json).toHaveBeenCalledWith(null);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('Sends error if it was thrown on requestLoginToken', async () => {
      const error = { message: 'Could not send token email' };
      const tokenService = {
        requestLoginToken: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        options: {},
        getServices: () => ({
          token: tokenService,
        }),
      };
      const middleware = requestLoginToken(accountsServer as any);
      const req = {
        body: {
          email: 'email',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().token.requestLoginToken).toHaveBeenCalledWith('email');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });

    it('hide UserNotFound error when ambiguousErrorMessages is true', async () => {
      const error = new AccountsJsError('User not found', RequestLoginTokenErrors.UserNotFound);
      const tokenService = {
        requestLoginToken: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        options: {
          ambiguousErrorMessages: true,
        },
        getServices: () => ({
          token: tokenService,
        }),
      };
      const middleware = requestLoginToken(accountsServer as any);
      const req = {
        body: {
          email: 'email',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().token.requestLoginToken).toHaveBeenCalledWith('email');
      expect(res.json).toHaveBeenCalledWith(null);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
