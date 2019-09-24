import {
  twoFactorSecret,
  twoFactorSet,
  twoFactorUnset,
} from '../../../src/endpoints/password/two-factor';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('twoFactor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('twoFactorSecret', () => {
    it('calls password.twoFactor and returns new secret', async () => {
      const passwordService = {
        twoFactor: {
          getNewAuthSecret: jest.fn(() => 'secret'),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = twoFactorSecret(accountsServer as any);

      const req = {
        body: {},
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.twoFactor.getNewAuthSecret).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ secret: 'secret' });
      expect(res.status).not.toHaveBeenCalled();
    });

    it('Sends error if it was thrown on twoFactorSecret', async () => {
      const error = { message: 'Error' };
      const passwordService = {
        twoFactor: {
          getNewAuthSecret: jest.fn(() => {
            throw error;
          }),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = twoFactorSecret(accountsServer as any);
      const req = {
        body: {
          token: 'token',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.twoFactor.getNewAuthSecret).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe('twoFactorSet', () => {
    it('calls password.twoFactor and set ', async () => {
      const passwordService = {
        twoFactor: {
          set: jest.fn(() => null),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = twoFactorSet(accountsServer as any);

      const req = {
        userId: 'userId',
        body: {
          secret: 'secret',
          code: 'code',
        },
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.twoFactor.set).toHaveBeenCalledWith(
        'userId',
        'secret',
        'code'
      );
      expect(res.json).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('Sends error if no userId', async () => {
      const middleware = twoFactorSet(null as any);
      await middleware({} as any, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
    });

    it('Sends error if it was thrown on twoFactorSecret', async () => {
      const error = { message: 'Error' };
      const passwordService = {
        twoFactor: {
          set: jest.fn(() => {
            throw error;
          }),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = twoFactorSet(accountsServer as any);
      const req = {
        userId: 'userId',
        body: {
          secret: 'secret',
          code: 'code',
        },
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.twoFactor.set).toHaveBeenCalledWith(
        'userId',
        'secret',
        'code'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe('twoFactorUnset', () => {
    it('calls password.twoFactor and set ', async () => {
      const passwordService = {
        twoFactor: {
          unset: jest.fn(() => null),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = twoFactorUnset(accountsServer as any);

      const req = {
        userId: 'userId',
        body: {
          code: 'code',
        },
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.twoFactor.unset).toHaveBeenCalledWith(
        'userId',
        'code'
      );
      expect(res.json).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('Sends error if no userId', async () => {
      const middleware = twoFactorUnset(null as any);
      await middleware({} as any, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
    });

    it('Sends error if it was thrown on twoFactorSecret', async () => {
      const error = { message: 'Error' };
      const passwordService = {
        twoFactor: {
          unset: jest.fn(() => {
            throw error;
          }),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = twoFactorUnset(accountsServer as any);
      const req = {
        userId: 'userId',
        body: {
          code: 'code',
        },
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.twoFactor.unset).toHaveBeenCalledWith(
        'userId',
        'code'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
