import 'reflect-metadata';
import { SendVerificationEmailErrors } from '@accounts/password';
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

describe('verifyEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyEmail', () => {
    it('calls password.verifyEmail and returns a message', async () => {
      const passwordService = {
        verifyEmail: jest.fn(() => null),
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
        .post('/password/verifyEmail')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);
      expect(accountsServer.getServices().password.verifyEmail).toHaveBeenCalledWith('token');
    });

    it('Sends error if it was thrown on verifyEmail', async () => {
      const error = { message: 'Could not verify email' };
      const passwordService = {
        verifyEmail: jest.fn(() => {
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
      };
      const response = await request(getApp(accountsServer))
        .post('/password/verifyEmail')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);
      expect(accountsServer.getServices().password.verifyEmail).toHaveBeenCalledWith('token');
    });
  });

  describe('sendVerificationEmail', () => {
    it('calls password.sendVerificationEmail and returns a message', async () => {
      const passwordService = {
        sendVerificationEmail: jest.fn(() => null),
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
        .post('/password/sendVerificationEmail')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);
      expect(accountsServer.getServices().password.sendVerificationEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });

    it('Sends error if it was thrown on sendVerificationEmail', async () => {
      const error = { message: 'Could not send verification email' };
      const passwordService = {
        sendVerificationEmail: jest.fn(() => {
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
        .post('/password/sendVerificationEmail')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);
      expect(accountsServer.getServices().password.sendVerificationEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });

    it('hide UserNotFound error when ambiguousErrorMessages is true', async () => {
      const error = new AccountsJsError('User not found', SendVerificationEmailErrors.UserNotFound);
      const passwordService = {
        sendVerificationEmail: jest.fn(() => {
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
        .post('/password/sendVerificationEmail')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);
      expect(accountsServer.getServices().password.sendVerificationEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });
  });
});
