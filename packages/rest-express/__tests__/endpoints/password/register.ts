import { registerPassword } from '../../../src/endpoints/password/register';

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('registerPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls password.createUser and returns the user json response', async () => {
    const userId = '1';
    const passwordService = {
      createUser: jest.fn(() => userId),
    };
    const accountsServer = {
      getServices: () => ({
        password: passwordService,
      }),
    };
    const middleware = registerPassword(accountsServer as any);

    const req = {
      body: {
        user: {
          username: 'toto',
        },
        extraFieldThatShouldNotBePassed: 'hey',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.getServices().password.createUser).toBeCalledWith({
      username: 'toto',
    });
    expect(res.json).toBeCalledWith({ userId: '1' });
    expect(res.status).not.toBeCalled();
  });

  it('Sends error if it was thrown on loginWithService', async () => {
    const error = { message: 'Could not login' };
    const passwordService = {
      createUser: jest.fn(() => {
        throw error;
      }),
    };
    const accountsServer = {
      getServices: () => ({
        password: passwordService,
      }),
    };
    const middleware = registerPassword(accountsServer as any);
    const req = {
      body: {
        user: {
          username: 'toto',
        },
        extraFieldThatShouldNotBePassed: 'hey',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.getServices().password.createUser).toBeCalledWith({
      username: 'toto',
    });
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(error);
  });
});
