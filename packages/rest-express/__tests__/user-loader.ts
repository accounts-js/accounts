import 'reflect-metadata';
import request from 'supertest';
import accountsExpress from '../src/express-middleware';
import express from 'express';
import * as getUser from '../src/endpoints/get-user';
/*
import { type matchedData } from 'express-validator';
import * as matchOrTrow from '../src/utils/matchOrTrow';

jest.mock('../src/utils/matchOrTrow', () => ({
  matchOrThrow: jest.fn((req: Request) => ({ ...req.body, ...req.params })),
}));

const actual = jest.requireActual("../src/utils/matchOrTrow"); // Has a default field if you need to access the default export
const spy = jest.spyOn(matchOrTrow, "matchOrThrow").mockImplementation((...args: Parameters<typeof matchedData>) => ({ ...args[0].body, ...args[0].params }));
await (middlewares[middlewares.length - 1] as any)(req as any, res);
expect(spy).toHaveBeenCalledTimes(1);
*/

function getApp(accountsServer: any, path?: string) {
  const router = accountsExpress(accountsServer as any, { path: path ?? '' });
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(router);
  return expressApp;
}
const getUserMiddleware = jest.fn(getUser.getUser());
jest.spyOn(getUser, 'getUser').mockImplementation(() => getUserMiddleware);

const user = { id: '1' };
const accountsServer = {
  getServices: () => jest.fn(),
  resumeSession: jest.fn(() => user),
};
describe('userLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does noting when request has no accessToken', async () => {
    const response = await request(getApp(accountsServer)).get('/user');
    expect(getUserMiddleware).toHaveBeenCalledTimes(1);
    expect(getUserMiddleware).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {},
      }),
      expect.anything(),
      expect.anything()
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(null);
    expect(accountsServer.resumeSession).not.toHaveBeenCalled();
  });

  it('load user to req object when access token is present on the headers', async () => {
    const response = await request(getApp(accountsServer))
      .get('/user')
      .set('Authorization', 'Bearer token');

    expect(getUserMiddleware).toHaveBeenCalledTimes(1);
    expect(getUserMiddleware).toHaveBeenCalledWith(
      expect.objectContaining({ authToken: 'token', user, userId: user.id }),
      expect.anything(),
      expect.anything()
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(user);
    expect(accountsServer.resumeSession).toHaveBeenCalledWith('token');
  });

  it('load user to req object when access token is present on the body', async () => {
    const body = {
      accessToken: 'token',
    };
    const response = await request(getApp(accountsServer)).get('/user').send(body);

    expect(getUserMiddleware).toHaveBeenCalledTimes(1);
    expect(getUserMiddleware).toHaveBeenCalledWith(
      expect.objectContaining({ authToken: 'token', user, userId: user.id }),
      expect.anything(),
      expect.anything()
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(user);
    expect(accountsServer.resumeSession).toHaveBeenCalledWith('token');
  });
});
