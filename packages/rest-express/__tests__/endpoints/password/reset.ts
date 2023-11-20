import 'reflect-metadata';
import { SendResetPasswordEmailErrors } from '@accounts/password';
import { AccountsJsError } from '@accounts/server';
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

describe('resetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resetPassword', () => {
    it('calls password.resetPassword and returns a message', async () => {
      const passwordService = {
        resetPassword: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };

      const body = {
        token: 'token',
        newPassword: 'new-password',
      };

      const response = await request(getApp(accountsServer))
        .post('/password/resetPassword')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);

      expect(accountsServer.getServices().password.resetPassword).toHaveBeenCalledWith(
        'token',
        'new-password',
        expect.anything()
      );
    });

    it('Sends error if it was thrown on resetPassword', async () => {
      const error = { message: 'Could not reset password' };
      const passwordService = {
        resetPassword: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const body = {
        token: 'token',
        newPassword: 'new-password',
      };

      const response = await request(getApp(accountsServer))
        .post('/password/resetPassword')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);

      expect(accountsServer.getServices().password.resetPassword).toHaveBeenCalledWith(
        'token',
        'new-password',
        expect.anything()
      );
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('calls password.sendResetPasswordEmail and returns a message', async () => {
      const passwordService = {
        sendResetPasswordEmail: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };

      const body = {
        email: 'valid@email.com',
      };

      const response = await request(getApp(accountsServer))
        .post('/password/sendResetPasswordEmail')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);

      expect(accountsServer.getServices().password.sendResetPasswordEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });

    it('Sends error if it was thrown on sendResetPasswordEmail', async () => {
      const error = { message: 'Could not send reset password' };
      const passwordService = {
        sendResetPasswordEmail: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        options: {},
        getServices: () => ({
          password: passwordService,
        }),
      };
      const body = {
        email: 'valid@email.com',
      };

      const response = await request(getApp(accountsServer))
        .post('/password/sendResetPasswordEmail')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);

      expect(accountsServer.getServices().password.sendResetPasswordEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });

    it('hide UserNotFound error when ambiguousErrorMessages is true', async () => {
      const error = new AccountsJsError(
        'User not found',
        SendResetPasswordEmailErrors.UserNotFound
      );
      const passwordService = {
        sendResetPasswordEmail: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        options: {
          ambiguousErrorMessages: true,
        },
        getServices: () => ({
          password: passwordService,
        }),
      };
      const body = {
        email: 'valid@email.com',
      };

      const response = await request(getApp(accountsServer))
        .post('/password/sendResetPasswordEmail')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);

      expect(accountsServer.getServices().password.sendResetPasswordEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });
  });
});
