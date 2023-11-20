import 'reflect-metadata';
import { LoginResult } from '@accounts/types';
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

describe('registerPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls password.createUser and returns the user json response', async () => {
    const userId = '1';
    const passwordService = {
      options: {},
      createUser: jest.fn(() => userId),
    };
    const accountsServer = {
      options: {},
      getServices: () => ({
        password: passwordService,
      }),
    };
    const body = {
      user: {
        username: 'toto',
        password: 'password',
      },
    };
    const response = await request(getApp(accountsServer)).post('/password/register').send(body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ userId });
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
      password: 'password',
    });
  });

  it('calls password.createUser and obfuscate user id if server have both ambiguousErrorMessages and requireEmailVerification', async () => {
    const userId = '1';
    const passwordService = {
      options: { requireEmailVerification: true },
      createUser: jest.fn(() => userId),
    };
    const accountsServer = {
      options: { ambiguousErrorMessages: true },
      getServices: () => ({
        password: passwordService,
      }),
    };
    const body = {
      user: {
        username: 'toto',
        password: 'password',
      },
    };
    const response = await request(getApp(accountsServer)).post('/password/register').send(body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
      password: 'password',
    });
  });

  it('calls password.createUser and not obfuscate user id if server have ambiguousErrorMessages but not requireEmailVerification', async () => {
    const userId = '1';
    const passwordService = {
      options: {},
      createUser: jest.fn(() => userId),
    };
    const accountsServer = {
      options: { ambiguousErrorMessages: true },
      getServices: () => ({
        password: passwordService,
      }),
    };
    const body = {
      user: {
        username: 'toto',
        password: 'password',
      },
    };
    const response = await request(getApp(accountsServer)).post('/password/register').send(body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ userId });
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
      password: 'password',
    });
  });

  it('calls password.createUser and obfuscate EmailAlreadyExists error if server have ambiguousErrorMessages', async () => {
    const passwordService = {
      options: {},
      createUser: jest.fn(() => {
        throw new AccountsJsError('EmailAlreadyExists', 'EmailAlreadyExists');
      }),
    };
    const accountsServer = {
      options: { ambiguousErrorMessages: true },
      getServices: () => ({
        password: passwordService,
      }),
    };
    const body = {
      user: {
        username: 'toto',
        password: 'password',
      },
    };
    const response = await request(getApp(accountsServer)).post('/password/register').send(body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
      password: 'password',
    });
  });

  it('calls password.createUser and obfuscate UsernameAlreadyExists error if server have ambiguousErrorMessages', async () => {
    const passwordService = {
      options: {},
      createUser: jest.fn(() => {
        throw new AccountsJsError('UsernameAlreadyExists', 'UsernameAlreadyExists');
      }),
    };
    const accountsServer = {
      options: { ambiguousErrorMessages: true },
      getServices: () => ({
        password: passwordService,
      }),
    };
    const body = {
      user: {
        username: 'toto',
        password: 'password',
      },
    };
    const response = await request(getApp(accountsServer)).post('/password/register').send(body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
      password: 'password',
    });
  });

  it('should automatically login user after registration if enableAutologin flag is set to true', async () => {
    const userId = '1';
    const userEmail = 'test@test.com';

    const passwordService = {
      options: {},
      createUser: jest.fn(() => userId),
    };

    const createdUser = {
      id: userId,
      emails: [
        {
          address: userEmail,
        },
      ],
    };

    const loginResult = {
      user: createdUser,
      tokens: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      },
    } as LoginResult;

    const accountsServer = {
      options: { enableAutologin: true, ambiguousErrorMessages: false },
      getServices: () => ({
        password: passwordService,
      }),
      findUserById: jest.fn(() => createdUser),
      loginWithUser: jest.fn(() => loginResult),
    };
    const body = {
      user: {
        email: userEmail,
        password: 'password',
      },
    };
    const response = await request(getApp(accountsServer)).post('/password/register').send(body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      userId,
      loginResult,
    });
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      email: userEmail,
      password: 'password',
    });
  });

  it('Sends error if it was thrown on loginWithService', async () => {
    const error = { message: 'Could not login' };
    const passwordService = {
      options: {},
      createUser: jest.fn(() => {
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
      user: {
        username: 'toto',
        password: 'password',
      },
    };
    const response = await request(getApp(accountsServer)).post('/password/register').send(body);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual(error);
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
      password: 'password',
    });
  });
});
