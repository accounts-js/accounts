import { challenge } from '../../../src/endpoints/mfa/challenge';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

const mfaService = {
  challenge: jest.fn(() => ({ mfaService: 'mfaServiceTest' })),
};

describe('challenge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call mfa associateByMfaToken method', async () => {
    const req = {
      body: {
        mfaToken: 'mfaTokenBody',
        authenticatorId: 'authenticatorIdBody',
      },
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = challenge({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.challenge).toBeCalledWith(
      req.body.mfaToken,
      req.body.authenticatorId,
      req.infos
    );
    expect(res.json).toBeCalledWith({ mfaService: 'mfaServiceTest' });
  });

  it('Sends error if it was thrown', async () => {
    const error = { message: 'Error' };
    mfaService.challenge.mockImplementationOnce(() => {
      throw error;
    });
    const req = {
      body: {
        mfaToken: 'mfaTokenBody',
        authenticatorId: 'authenticatorIdBody',
      },
      infos: {
        ip: 'ipTest',
        userAgent: 'userAgentTest',
      },
    };
    const middleware = challenge({
      getService: () => mfaService,
    } as any);
    await middleware(req as any, res);
    expect(mfaService.challenge).toBeCalledWith(
      req.body.mfaToken,
      req.body.authenticatorId,
      req.infos
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});
