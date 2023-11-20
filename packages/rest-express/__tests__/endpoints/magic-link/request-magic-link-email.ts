import 'reflect-metadata';
import { RequestMagicLinkEmailErrors } from '@accounts/magic-link';
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

  describe('requestMagicLinkEmail', () => {
    it('calls magicLink.requestMagicLinkEmail and returns a message', async () => {
      const magicLinkService = {
        requestMagicLinkEmail: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          magicLink: magicLinkService,
        }),
      };
      const body = {
        email: 'valid@email.com',
      };
      const response = await request(getApp(accountsServer))
        .post('/magiclink/requestMagicLinkEmail')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);
      expect(accountsServer.getServices().magicLink.requestMagicLinkEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });

    it('Sends error if it was thrown on requestMagicLinkEmail', async () => {
      const error = { message: 'Could not send magic link email' };
      const magicLinkService = {
        requestMagicLinkEmail: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        options: {},
        getServices: () => ({
          magicLink: magicLinkService,
        }),
      };
      const body = {
        email: 'valid@email.com',
      };
      const response = await request(getApp(accountsServer))
        .post('/magiclink/requestMagicLinkEmail')
        .send(body);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(error);
      expect(accountsServer.getServices().magicLink.requestMagicLinkEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });

    it('hide UserNotFound error when ambiguousErrorMessages is true', async () => {
      const error = new AccountsJsError('User not found', RequestMagicLinkEmailErrors.UserNotFound);
      const magicLinkService = {
        requestMagicLinkEmail: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        options: {
          ambiguousErrorMessages: true,
        },
        getServices: () => ({
          magicLink: magicLinkService,
        }),
      };
      const body = {
        email: 'valid@email.com',
      };
      const response = await request(getApp(accountsServer))
        .post('/magiclink/requestMagicLinkEmail')
        .send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(null);
      expect(accountsServer.getServices().magicLink.requestMagicLinkEmail).toHaveBeenCalledWith(
        'valid@email.com'
      );
    });
  });
});
