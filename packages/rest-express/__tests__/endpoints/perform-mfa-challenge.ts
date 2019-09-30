import { performMfaChallenge } from '../../src/endpoints/perform-mfa-challenge';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('performMfaChallenge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls performMfaChallenge and returns the login token in json format', async () => {
    const loginToken = 'login-token';
    const accountsServer = {
      performMfaChallenge: jest.fn(() => loginToken),
    };
    const middleware = performMfaChallenge(accountsServer as any);

    const req = {
      body: {
        challenge: 'sms',
        mfaToken: 'mfa-token',
        params: {
          phone: '1122',
        },
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.performMfaChallenge).toBeCalledWith('sms', 'mfa-token', {
      phone: '1122',
    });
    expect(res.json).toBeCalledWith(loginToken);
    expect(res.status).not.toBeCalled();
  });

  it('Sends error if it was thrown on performMfaChallenge', async () => {
    const error = { message: 'Could not performMfaChallenge' };
    const accountsServer = {
      performMfaChallenge: jest.fn(() => {
        throw error;
      }),
    };
    const middleware = performMfaChallenge(accountsServer as any);
    const req = {
      body: {
        challenge: 'sms',
        mfaToken: 'mfa-token',
        params: {
          phone: '1122',
        },
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.performMfaChallenge).toBeCalledWith('sms', 'mfa-token', {
      phone: '1122',
    });
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(error);
  });
});
