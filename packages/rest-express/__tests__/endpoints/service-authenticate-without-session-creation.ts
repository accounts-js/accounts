import { serviceAuthenticateWithoutSessionCreation } from '../../src/endpoints/service-authenticate-without-session-creation';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('serviceAuthenticateWithoutSessionCreation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls authenticateWithService and returns the user in json format', async () => {
    const accountsServer = {
      authenticateWithService: jest.fn(() => true),
    };
    const middleware = serviceAuthenticateWithoutSessionCreation(accountsServer as any);

    const req = {
      params: {
        service: 'sms',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.authenticateWithService).toBeCalledWith('sms', undefined, {
      ip: null,
      userAgent: '',
    });
    expect(res.json).toBeCalledWith(true);
    expect(res.status).not.toBeCalled();
  });

  it('Sends error if it was thrown on loginWithService', async () => {
    const error = { message: 'Could not login' };
    const accountsServer = {
      authenticateWithService: jest.fn(() => {
        throw error;
      }),
    };
    const middleware = serviceAuthenticateWithoutSessionCreation(accountsServer as any);
    const req = {
      params: {
        service: 'sms',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.authenticateWithService).toBeCalledWith('sms', undefined, {
      ip: null,
      userAgent: '',
    });
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(error);
  });
});
