import { AccountsJsError } from '@accounts/server';
import { AccountsToken, RequestLoginTokenErrors } from '@accounts/token';
import { Mutation } from '../../../../src/modules/accounts-token/resolvers/mutation';

describe('accounts-token resolvers mutation', () => {
  const accountsServerMock = {
    options: {},
  };
  const accountsTokenMock = {
    requestLoginToken: jest.fn(),
  };
  let injector: { get: jest.Mock };

  beforeEach(() => {
    injector = {
      get: jest.fn((arg) => (arg === AccountsToken ? accountsTokenMock : accountsServerMock)),
    };
    jest.clearAllMocks();
  });

  describe('requestLoginToken', () => {
    const email = 'emailTest';

    it('should call requestLoginToken', async () => {
      await Mutation.requestLoginToken!({}, { email } as any, { injector } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsToken);
      expect(accountsTokenMock.requestLoginToken).toHaveBeenCalledWith(email);
    });

    it('should rethrow all errors if server have ambiguousErrorMessages', async () => {
      const requestLoginTokenMock = jest.fn(() => {
        throw new AccountsJsError('AnyError', 'AnyError');
      });
      injector.get = jest.fn((arg) =>
        arg === AccountsToken
          ? {
              requestLoginToken: requestLoginTokenMock,
            }
          : {
              options: { ambiguousErrorMessages: true },
            }
      );
      await expect(
        Mutation.requestLoginToken!({}, { email } as any, { injector } as any, {} as any)
      ).rejects.toThrowError('AnyError');
    });

    it('should hide UserNotFound error when ambiguousErrorMessages is true', async () => {
      const requestLoginTokenMock = jest.fn(() => {
        throw new AccountsJsError('User not found', RequestLoginTokenErrors.UserNotFound);
      });
      injector.get = jest.fn((arg) =>
        arg === AccountsToken
          ? {
              requestLoginToken: requestLoginTokenMock,
            }
          : {
              options: { ambiguousErrorMessages: true },
            }
      );

      await Mutation.requestLoginToken!({}, { email } as any, { injector } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsToken);
      expect(requestLoginTokenMock).toHaveBeenCalledWith(email);
    });
  });
});
