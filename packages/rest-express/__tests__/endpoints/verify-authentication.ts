import 'reflect-metadata';
import request from 'supertest';
import accountsExpress from '../../src/express-middleware';
import express from 'express';

function getApp(accountsServer: any, path?: string) {
  const router = accountsExpress(accountsServer as any, { path: path ?? '' });
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(router);
  return expressApp;
}

describe('serviceVerifyAuthentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls authenticateWithService and returns the user in json format', async () => {
    const accountsServer = {
      getServices: () => jest.fn(),
      authenticateWithService: jest.fn(() => true),
    };
    const response = await request(getApp(accountsServer)).post('/sms/verifyAuthentication');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(true);
    expect(accountsServer.authenticateWithService).toHaveBeenCalledWith(
      'sms',
      {},
      expect.anything()
    );
  });

  it('Sends error if it was thrown on loginWithService', async () => {
    const error = { message: 'Could not login' };
    const accountsServer = {
      getServices: () => jest.fn(),
      authenticateWithService: jest.fn(() => {
        throw error;
      }),
    };
    const response = await request(getApp(accountsServer)).post('/sms/verifyAuthentication');

    expect(response.status).toEqual(400);
    expect(response.body).toEqual(error);
    expect(accountsServer.authenticateWithService).toHaveBeenCalledWith(
      'sms',
      {},
      expect.anything()
    );
  });
});
