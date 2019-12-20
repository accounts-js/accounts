import { logout } from '../../src/endpoints/logout';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls logout and returns a message if when logged out successfuly', async () => {
    const accountsServer = {
      logout: jest.fn(),
    };
    const middleware = logout(accountsServer as any);

    const req = {
      authToken: 'token',
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.logout).toHaveBeenCalledWith('token');
    expect(res.json).toHaveBeenCalledWith(null);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('Sends error if it was thrown on logout', async () => {
    const error = { message: 'Could not logout' };
    const accountsServer = {
      logout: jest.fn(() => {
        throw error;
      }),
    };
    const middleware = logout(accountsServer as any);
    const req = {
      authToken: 'token',
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.logout).toHaveBeenCalledWith('token');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
