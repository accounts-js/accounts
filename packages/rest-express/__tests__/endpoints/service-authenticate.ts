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

describe('serviceAuthenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls loginWithService and returns the user in json format', async () => {
    const user = {
      id: '1',
    };
    const accountsServer = {
      getServices: () => jest.fn(),
      loginWithService: jest.fn(() => user),
    };
    const response = await request(getApp(accountsServer)).post('/sms/authenticate');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(user);
    expect(accountsServer.loginWithService).toHaveBeenCalledWith('sms', {}, expect.anything());
  });

  it('Sends error if it was thrown on loginWithService', async () => {
    const error = { message: 'Could not login' };
    const accountsServer = {
      getServices: () => jest.fn(),
      loginWithService: jest.fn(() => {
        throw error;
      }),
    };
    const response = await request(getApp(accountsServer)).post('/sms/authenticate');

    expect(response.status).toEqual(400);
    expect(response.body).toEqual(error);
    expect(accountsServer.loginWithService).toHaveBeenCalledWith('sms', {}, expect.anything());
  });
});
