import { AccountsPassword } from '@accounts/password';
import { Query } from '../../../../src/modules/accounts-password/resolvers/query';

describe('accounts-password resolvers query', () => {
  const accountsPasswordMock = {
    twoFactor: {
      getNewAuthSecret: jest.fn(),
    },
  };
  const injector = {
    get: jest.fn(() => accountsPasswordMock),
  };
  const user = { id: 'idTest' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('twoFactorSecret', () => {
    it('should throw if no user in context', async () => {
      try {
        await Query.twoFactorSecret!({}, {}, {} as any, {} as any);
        throw new Error();
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }
    });

    it('should call getNewAuthSecret', async () => {
      await Query.twoFactorSecret!({}, {}, { injector, user } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(accountsPasswordMock.twoFactor.getNewAuthSecret).toHaveBeenCalledWith();
    });
  });
});
