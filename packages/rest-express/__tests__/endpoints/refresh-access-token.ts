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

describe('refreshAccessToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls refreshTokens and returns the session in json format', async () => {
    const session = {
      user: {
        id: '1',
      },
    };
    const accountsServer = {
      getServices: () => jest.fn(),
      refreshTokens: jest.fn(() => session),
    };
    const body = {
      accessToken: 'token',
      refreshToken: 'refresh',
    };
    const response = await request(getApp(accountsServer)).post('/refreshTokens').send(body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(session);
    expect(accountsServer.refreshTokens).toHaveBeenCalledWith(
      'token',
      'refresh',
      expect.anything()
    );
  });

  it('Sends error if it was thrown on refreshTokens', async () => {
    const error = { message: 'error' };
    const accountsServer = {
      getServices: () => jest.fn(),
      refreshTokens: jest.fn(() => {
        throw error;
      }),
    };
    const body = {
      accessToken: 'token',
      refreshToken: 'refresh',
    };
    const response = await request(getApp(accountsServer)).post('/refreshTokens').send(body);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual(error);
    expect(accountsServer.refreshTokens).toHaveBeenCalledWith(
      'token',
      'refresh',
      expect.anything()
    );
  });
});
