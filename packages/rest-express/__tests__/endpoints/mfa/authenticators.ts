import {
  authenticators,
  authenticatorsByMfaToken,
} from '../../../src/endpoints/mfa/authenticators';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

const mfaService = {
  findUserAuthenticators: jest.fn(() => ({ mfaService: 'mfaServiceTest' })),
  findUserAuthenticatorsByMfaToken: jest.fn(() => ({ mfaService: 'mfaServiceTest' })),
};

describe('authenticators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if user is not logged in', async () => {
    const middleware = authenticators({} as any);
    await middleware({} as any, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({ message: 'Unauthorized' });
  });

  it('should call mfa findUserAuthenticators method', async () => {
    const req = {
      userId: 'userIdTest',
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = authenticators({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.findUserAuthenticators).toBeCalledWith('userIdTest');
    expect(res.json).toBeCalledWith({ mfaService: 'mfaServiceTest' });
  });

  it('Sends error if it was thrown', async () => {
    const error = { message: 'Error' };
    mfaService.findUserAuthenticators.mockImplementationOnce(() => {
      throw error;
    });
    const req = {
      userId: 'userIdTest',
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = authenticators({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.findUserAuthenticators).toBeCalledWith('userIdTest');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});

describe('authenticatorsByMfaToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call mfa findUserAuthenticatorsByMfaToken method', async () => {
    const req = {
      query: {
        mfaToken: 'mfaTokenBody',
      },
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = authenticatorsByMfaToken({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.findUserAuthenticatorsByMfaToken).toBeCalledWith(req.query.mfaToken);
    expect(res.json).toBeCalledWith({ mfaService: 'mfaServiceTest' });
  });

  it('Sends error if it was thrown', async () => {
    const error = { message: 'Error' };
    mfaService.findUserAuthenticatorsByMfaToken.mockImplementationOnce(() => {
      throw error;
    });
    const req = {
      query: {
        mfaToken: 'mfaTokenBody',
      },
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = authenticatorsByMfaToken({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.findUserAuthenticatorsByMfaToken).toBeCalledWith(req.query.mfaToken);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
