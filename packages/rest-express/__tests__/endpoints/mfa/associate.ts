import { associate, associateByMfaToken } from '../../../src/endpoints/mfa/associate';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

const mfaService = {
  associate: jest.fn(() => ({ mfaService: 'mfaServiceTest' })),
  associateByMfaToken: jest.fn(() => ({ mfaService: 'mfaServiceTest' })),
};

describe('associate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if user is not logged in', async () => {
    const middleware = associate({} as any);
    await middleware({} as any, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({ message: 'Unauthorized' });
  });

  it('should call mfa associate method', async () => {
    const req = {
      userId: 'userIdTest',
      body: {
        type: 'typeBody',
        params: 'paramsBody',
      },
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = associate({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.associate).toBeCalledWith(
      'userIdTest',
      req.body.type,
      req.body.params,
      req.infos
    );
    expect(res.json).toBeCalledWith({ mfaService: 'mfaServiceTest' });
  });

  it('Sends error if it was thrown', async () => {
    const error = { message: 'Error' };
    mfaService.associate.mockImplementationOnce(() => {
      throw error;
    });
    const req = {
      userId: 'userIdTest',
      body: {
        type: 'typeBody',
        params: 'paramsBody',
      },
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = associate({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.associate).toBeCalledWith(
      'userIdTest',
      req.body.type,
      req.body.params,
      req.infos
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});

describe('associateByMfaToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call mfa associateByMfaToken method', async () => {
    const req = {
      body: {
        mfaToken: 'mfaTokenBody',
        type: 'typeBody',
        params: 'paramsBody',
      },
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = associateByMfaToken({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.associateByMfaToken).toBeCalledWith(
      req.body.mfaToken,
      req.body.type,
      req.body.params,
      req.infos
    );
    expect(res.json).toBeCalledWith({ mfaService: 'mfaServiceTest' });
  });

  it('Sends error if it was thrown', async () => {
    const error = { message: 'Error' };
    mfaService.associateByMfaToken.mockImplementationOnce(() => {
      throw error;
    });
    const req = {
      body: {
        mfaToken: 'mfaTokenBody',
        type: 'typeBody',
        params: 'paramsBody',
      },
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = associateByMfaToken({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.associateByMfaToken).toBeCalledWith(
      req.body.mfaToken,
      req.body.type,
      req.body.params,
      req.infos
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
