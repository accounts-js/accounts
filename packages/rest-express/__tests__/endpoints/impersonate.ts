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

describe('impersonate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls impersonate and returns the impersonate json response', async () => {
    const impersonateReturnType = {
      id: '1',
    };
    const accountsServer = {
      getServices: () => jest.fn(),
      impersonate: jest.fn(() => impersonateReturnType),
    };
    const body = {
      impersonated: { username: 'toto' },
      accessToken: 'token',
    };
    const response = await request(getApp(accountsServer)).post('/impersonate').send(body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(impersonateReturnType);
    expect(accountsServer.impersonate).toHaveBeenCalledWith(
      'token',
      { username: 'toto' },
      expect.anything()
    );
  });

  it('Sends error if it was thrown on impersonate', async () => {
    const error = { message: 'Could not impersonate' };
    const accountsServer = {
      getServices: () => jest.fn(),
      impersonate: jest.fn(() => {
        throw error;
      }),
    };
    const body = {
      impersonated: { username: 'toto' },
      accessToken: 'token',
    };
    const response = await request(getApp(accountsServer)).post('/impersonate').send(body);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual(error);
    expect(accountsServer.impersonate).toHaveBeenCalledWith(
      'token',
      { username: 'toto' },
      expect.anything()
    );
  });
});
