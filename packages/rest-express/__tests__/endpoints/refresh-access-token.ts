import { refreshAccessToken } from '../../src/endpoints/refresh-access-token';

const res: any = {
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

    await middleware(req as any, res);

    expect(accountsServer.refreshTokens).toHaveBeenCalledWith('token', 'refresh', null, '');
    expect(req).toEqual(reqCopy);
    expect(res.json).toHaveBeenCalledWith(session);
    expect(res.status).not.toHaveBeenCalled();
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

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.refreshTokens).toHaveBeenCalledWith('token', 'refresh', null, '');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
