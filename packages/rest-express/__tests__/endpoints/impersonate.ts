import { impersonate } from '../../src/endpoints/impersonate';

const res = {
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
        username: 'toto',
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.impersonate).toBeCalledWith(
      'token',
      'toto',
      null,
      ''
    );
    expect(res.json).toBeCalledWith(impersonateReturnType);
    expect(res.status).not.toBeCalled();
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
        username: 'toto',
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.impersonate).toBeCalledWith(
      'token',
      'toto',
      null,
      ''
    );
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(error);
  });
});
