import { providerCallback } from '../../../src/endpoints/oauth/provider-callback';

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('providerCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls loginWithService and returns the user json response', async () => {
    const user = {
      id: '1',
    };
    const accountsServer = {
      loginWithService: jest.fn(() => user),
    };
    const middleware = providerCallback(accountsServer as any);

    const req = {
      params: {
        accessToken: 'token',
      },
      query: {
        accessTokenSecret: 'secret',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.loginWithService).toBeCalledWith(
      'oauth',
      { accessToken: 'token', accessTokenSecret: 'secret' },
      { ip: null, userAgent: '' }
    );
    expect(res.json).toBeCalledWith(user);
    expect(res.status).not.toBeCalled();
  });

  it('Sends error if it was thrown on loginWithService', async () => {
    const error = { message: 'Could not login' };
    const accountsServer = {
      loginWithService: jest.fn(() => {
        throw error;
      }),
    };
    const middleware = providerCallback(accountsServer as any);
    const req = {
      params: {
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.loginWithService).toBeCalledWith(
      'oauth',
      { accessToken: 'token' },
      { ip: null, userAgent: '' }
    );
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(error);
  });
});
