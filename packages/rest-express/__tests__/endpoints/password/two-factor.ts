import 'reflect-metadata';
import request from 'supertest';
import accountsExpress from '../../../src/express-middleware';
import express from 'express';

function getApp(accountsServer: any, path?: string) {
  const router = accountsExpress(accountsServer as any, { path: path ?? '' });
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(router);
  return expressApp;
}

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
      const response = await request(getApp(accountsServer)).post('/password/twoFactorSecret');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ secret: 'secret' });
      expect(accountsServer.getServices().password.twoFactor.getNewAuthSecret).toHaveBeenCalled();
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
      const body = {
        token: 'token',
      };
      const response = await request(getApp(accountsServer))
        .post('/password/twoFactorSecret')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);
      expect(accountsServer.getServices().password.twoFactor.getNewAuthSecret).toHaveBeenCalled();
    });
  });

  describe('twoFactorSet', () => {
    it('calls password.twoFactor and set', async () => {
      const passwordService = {
        twoFactor: {
          set: jest.fn(() => null),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
        resumeSession: jest.fn(() => ({ id: 'userId' })),
      };
      const body = {
        accessToken: 'token',
        secret: { base32: 'secret' },
        code: 'code',
      };
      const response = await request(getApp(accountsServer))
        .post('/password/twoFactorSet')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({});
      expect(accountsServer.getServices().password.twoFactor.set).toHaveBeenCalledWith(
        'userId',
        { base32: 'secret' },
        'code'
      );
    });

    it('Sends error if no userId', async () => {
      const passwordService = {
        twoFactor: {
          set: jest.fn(() => null),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
        resumeSession: jest.fn(() => undefined),
      };
      const response = await request(getApp(accountsServer)).post('/password/twoFactorSet');

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({ message: 'Unauthorized' });
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
        resumeSession: jest.fn(() => ({ id: 'userId' })),
      };
      const body = {
        accessToken: 'token',
        secret: { base32: 'secret' },
        code: 'code',
      };
      const response = await request(getApp(accountsServer))
        .post('/password/twoFactorSet')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);
      expect(accountsServer.getServices().password.twoFactor.set).toHaveBeenCalledWith(
        'userId',
        { base32: 'secret' },
        'code'
      );
    });
  });

  describe('twoFactorUnset', () => {
    it('calls password.twoFactor and set', async () => {
      const passwordService = {
        twoFactor: {
          unset: jest.fn(() => null),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
        resumeSession: jest.fn(() => ({ id: 'userId' })),
      };
      const body = {
        accessToken: 'token',
        code: 'code',
      };
      const response = await request(getApp(accountsServer))
        .post('/password/twoFactorUnset')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({});
      expect(accountsServer.getServices().password.twoFactor.unset).toHaveBeenCalledWith(
        'userId',
        'code'
      );
    });

    it('Sends error if no userId', async () => {
      const passwordService = {
        twoFactor: {
          unset: jest.fn(() => null),
        },
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
        resumeSession: jest.fn(() => undefined),
      };
      const body = {
        accessToken: 'token',
      };
      const response = await request(getApp(accountsServer))
        .post('/password/twoFactorUnset')
        .send(body);

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({ message: 'Unauthorized' });
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
        resumeSession: jest.fn(() => ({ id: 'userId' })),
      };
      const body = {
        accessToken: 'token',
        code: 'code',
      };
      const response = await request(getApp(accountsServer))
        .post('/password/twoFactorUnset')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);
      expect(accountsServer.getServices().password.twoFactor.unset).toHaveBeenCalledWith(
        'userId',
        'code'
      );
    });
  });
});
