import { serviceAuthenticate } from '../../src/endpoints/service-authenticate';

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('serviceAuthenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls loginWithService and returns the user in json format', async () => {
    const user = {
      id: '1',
    };
    const accountsServer = {
      loginWithService: jest.fn(() => user),
    };
    const middleware = serviceAuthenticate(accountsServer as any);

    const req = {
      params: {
        service: 'sms',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.loginWithService).toBeCalledWith('sms', undefined, {
      ip: null,
      userAgent: '',
    });
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
    const middleware = serviceAuthenticate(accountsServer as any);
    const req = {
      params: {
        service: 'sms',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.loginWithService).toBeCalledWith('sms', undefined, {
      ip: null,
      userAgent: '',
    });
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(error);
  });
});
