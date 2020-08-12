import { AccountsMfa } from '@accounts/mfa';
import { Query } from '../../../../src/modules/accounts-mfa/resolvers/query';

describe('accounts-mfa resolvers query', () => {
  const accountsMfaMock = {
    findUserAuthenticators: jest.fn(),
    findUserAuthenticatorsByMfaToken: jest.fn(),
  };
  const injector = {
    get: jest.fn(() => accountsMfaMock),
  };
  const user = { id: 'idTest' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticators', () => {
    it('should throw if no user in context', async () => {
      await expect(Query.authenticators!({}, {}, {} as any, {} as any)).rejects.toThrowError(
        'Unauthorized'
      );
    });

    it('should call findUserAuthenticators', async () => {
      await Query.authenticators!({}, {}, { injector, user } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsMfa);
      expect(accountsMfaMock.findUserAuthenticators).toHaveBeenCalledWith(user.id);
    });
  });

  describe('authenticatorsByMfaToken', () => {
    it('should call findUserAuthenticators', async () => {
      const mfaToken = 'mfaTokenTest';
      await Query.authenticatorsByMfaToken!({}, { mfaToken }, { injector } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsMfa);
      expect(accountsMfaMock.findUserAuthenticatorsByMfaToken).toHaveBeenCalledWith(mfaToken);
    });
  });
});
