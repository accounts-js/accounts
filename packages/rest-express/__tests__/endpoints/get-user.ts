import { getUser } from '../../src/endpoints/get-user';

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('getUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getUser and returns the user json response', async () => {
    const user = {
      id: '1',
    };
    const accountsServer = {
      resumeSession: jest.fn(() => user),
    };
    const middleware = getUser(accountsServer as any);

    const req = {
      body: {
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.resumeSession).toBeCalledWith('token');
    expect(res.json).toBeCalledWith(user);
    expect(res.status).not.toBeCalled();
  });

  it('Sends error if it was thrown on getUser', async () => {
    const error = { message: 'Could not get user' };
    const accountsServer = {
      resumeSession: jest.fn(() => {
        throw error;
      }),
    };
    const middleware = getUser(accountsServer as any);
    const req = {
      body: {
        accessToken: 'token',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.resumeSession).toBeCalledWith('token');
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(error);
  });
});
