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

describe('changePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('changePassword', () => {
    it('calls password.changePassword', async () => {
      const passwordService = {
        changePassword: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
        resumeSession: jest.fn(() => ({ id: 'userId' })),
      };
      const body = {
        accessToken: 'token',
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
      };
      const response = await request(getApp(accountsServer))
        .post('/password/changePassword')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);
      expect(accountsServer.getServices().password.changePassword).toHaveBeenCalledWith(
        'userId',
        'oldPassword',
        'newPassword'
      );
    });

    it('Sends error if no userId', async () => {
      const passwordService = {
        changePassword: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
        resumeSession: jest.fn(() => undefined),
      };
      const response = await request(getApp(accountsServer)).post('/password/changePassword');

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('Sends error if it was thrown on twoFactorSecret', async () => {
      const error = { message: 'Error' };
      const passwordService = {
        changePassword: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
        resumeSession: jest.fn(() => ({ id: 'userId' })),
      };
      const body = {
        accessToken: 'token',
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
      };
      const response = await request(getApp(accountsServer))
        .post('/password/changePassword')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);
      expect(accountsServer.getServices().password.changePassword).toHaveBeenCalledWith(
        'userId',
        'oldPassword',
        'newPassword'
      );
    });
  });
});
