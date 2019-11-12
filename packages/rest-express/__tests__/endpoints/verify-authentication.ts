import { serviceVerifyAuthentication } from '../../src/endpoints/verify-authentication';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('serviceVerifyAuthentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls authenticateWithService and returns the user in json format', async () => {
    const accountsServer = {
      authenticateWithService: jest.fn(() => true),
    };
    const middleware = serviceVerifyAuthentication(accountsServer as any);

    const req = {
      params: {
        service: 'sms',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.authenticateWithService).toHaveBeenCalledWith('sms', undefined, {
      ip: null,
      userAgent: '',
    });
    expect(res.json).toHaveBeenCalledWith(true);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('Sends error if it was thrown on loginWithService', async () => {
    const error = { message: 'Could not login' };
    const accountsServer = {
      authenticateWithService: jest.fn(() => {
        throw error;
      }),
    };
    const middleware = serviceVerifyAuthentication(accountsServer as any);
    const req = {
      params: {
        service: 'sms',
      },
      headers: {},
    };
    const reqCopy = { ...req };

    await middleware(req as any, res);

    expect(req).toEqual(reqCopy);
    expect(accountsServer.authenticateWithService).toHaveBeenCalledWith('sms', undefined, {
      ip: null,
      userAgent: '',
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
