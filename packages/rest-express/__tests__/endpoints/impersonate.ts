import { impersonate } from '../../src/endpoints/impersonate';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('impersonate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls impersonate and returns the impersonate json response', async () => {
    const impersonateReturnType = {
      id: '1',
    };
    const accountsServer = {
      impersonate: jest.fn(() => impersonateReturnType),
    };
    const middleware = impersonate(accountsServer as any);

    const req = {
      body: {
        impersonated: 'toto',
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.impersonate).toHaveBeenCalledWith('token', 'toto', null, '');
    expect(res.json).toHaveBeenCalledWith(impersonateReturnType);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('Sends error if it was thrown on impersonate', async () => {
    const error = { message: 'Could not impersonate' };
    const accountsServer = {
      impersonate: jest.fn(() => {
        throw error;
      }),
    };
    const middleware = impersonate(accountsServer as any);
    const req = {
      body: {
        impersonated: 'toto',
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.impersonate).toHaveBeenCalledWith('token', 'toto', null, '');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
