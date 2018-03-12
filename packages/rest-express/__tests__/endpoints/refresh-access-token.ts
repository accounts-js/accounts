import { refreshAccessToken } from '../../src/endpoints/refresh-access-token';

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

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
      refreshTokens: jest.fn(() => session),
    };
    const middleware = refreshAccessToken(accountsServer as any);

    const req = {
      headers: {},
      body: {
        accessToken: 'token',
        refreshToken: 'refresh',
      },
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(accountsServer.refreshTokens).toBeCalledWith(
      'token',
      'refresh',
      null,
      ''
    );
    expect(req).toEqual(reqCopy);
    expect(res.json).toBeCalledWith(session);
    expect(res.status).not.toBeCalled();
  });

  it('Sends error if it was thrown on refreshTokens', async () => {
    const error = { message: 'error' };
    const accountsServer = {
      refreshTokens: jest.fn(() => {
        throw error;
      }),
    };
    const middleware = refreshAccessToken(accountsServer as any);
    const req = {
      headers: {},
      body: {
        accessToken: 'token',
        refreshToken: 'refresh',
      },
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.refreshTokens).toBeCalledWith(
      'token',
      'refresh',
      null,
      ''
    );
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(error);
  });
});
