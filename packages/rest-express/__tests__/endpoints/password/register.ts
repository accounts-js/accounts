import { registerPassword } from '../../../src/endpoints/password/register';

const res: any = {
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
      options: {},
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

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
    });
    expect(res.json).toHaveBeenCalledWith('1');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('calls password.createUser and returns null if server have ambiguousErrorMessages', async () => {
    const userId = '1';
    const passwordService = {
      createUser: jest.fn(() => userId),
    };
    const accountsServer = {
      options: { ambiguousErrorMessages: true },
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

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
    });
    expect(res.json).toHaveBeenCalledWith(null);
    expect(res.status).not.toHaveBeenCalled();
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

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.getServices().password.createUser).toHaveBeenCalledWith({
      username: 'toto',
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
