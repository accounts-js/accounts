import { AccountsMfa } from '@accounts/mfa';
import { Mutation } from '../../../../src/modules/accounts-mfa/resolvers/mutation';

describe('accounts-mfa resolvers mutations', () => {
  const accountsMfaMock = {
    challenge: jest.fn(),
    associate: jest.fn(),
    associateByMfaToken: jest.fn(),
  };
  const injector = {
    get: jest.fn(() => accountsMfaMock),
  };
  const user = { id: 'idTest' };
  const infos = {
    ip: 'ipTest',
    userAgent: 'userAgentTest',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('challenge', () => {
    it('should call associateByMfaToken', async () => {
      const mfaToken = 'mfaTokenTest';
      const authenticatorId = 'authenticatorIdTest';
      await Mutation.challenge!(
        {},
        { mfaToken, authenticatorId },
        { injector, infos } as any,
        {} as any
      );
      expect(injector.get).toHaveBeenCalledWith(AccountsMfa);
      expect(accountsMfaMock.challenge).toHaveBeenCalledWith(mfaToken, authenticatorId, infos);
    });
  });

  describe('associate', () => {
    it('should throw if no user in context', async () => {
      await expect(Mutation.associate!({}, {} as any, {} as any, {} as any)).rejects.toThrowError(
        'Unauthorized'
      );
    });

    it('should call associate', async () => {
      const type = 'typeTest';
      const params = 'paramsTest';
      await Mutation.associate!(
        {},
        { type, params: params as any },
        { user, injector, infos } as any,
        {} as any
      );
      expect(injector.get).toHaveBeenCalledWith(AccountsMfa);
      expect(accountsMfaMock.associate).toHaveBeenCalledWith(user.id, type, params, infos);
    });
  });

  describe('associateByMfaToken', () => {
    it('should call associateByMfaToken', async () => {
      const mfaToken = 'mfaTokenTest';
      const type = 'typeTest';
      const params = 'paramsTest';
      await Mutation.associateByMfaToken!(
        {},
        { mfaToken, type, params: params as any },
        { injector, infos } as any,
        {} as any
      );
      expect(injector.get).toHaveBeenCalledWith(AccountsMfa);
      expect(accountsMfaMock.associateByMfaToken).toHaveBeenCalledWith(
        mfaToken,
        type,
        params,
        infos
      );
    });
  });
});
