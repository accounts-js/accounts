import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { Mutation } from '../../../../src/modules/accounts-password/resolvers/mutation';

describe('accounts-password resolvers mutation', () => {
  const accountsServerMock = {
    options: {},
  };
  const accountsPasswordMock = {
    changePassword: jest.fn(),
    createUser: jest.fn(),
    resetPassword: jest.fn(),
    sendResetPasswordEmail: jest.fn(),
    sendVerificationEmail: jest.fn(),
    verifyEmail: jest.fn(),
    twoFactor: {
      set: jest.fn(),
      unset: jest.fn(),
    },
  };
  const injector = {
    get: jest.fn(arg => (arg === AccountsPassword ? accountsPasswordMock : accountsServerMock)),
  };
  const user = { id: 'idTest' };
  const ip = 'ipTest';
  const userAgent = 'userAgentTest';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('changePassword', () => {
    const oldPassword = 'oldPasswordTest';
    const newPassword = 'newPasswordTest';

    it('should throw if no user in context', async () => {
      try {
        await Mutation.changePassword!({}, { oldPassword, newPassword }, {} as any, {} as any);
        throw new Error();
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }
    });

    it('should call changePassword', async () => {
      await Mutation.changePassword!(
        {},
        { oldPassword, newPassword },
        { user, injector } as any,
        {} as any
      );
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(accountsPasswordMock.changePassword).toHaveBeenCalledWith(
        user.id,
        oldPassword,
        newPassword
      );
    });
  });

  describe('createUser', () => {
    it('should call createUser', async () => {
      await Mutation.createUser!({}, { user } as any, { injector } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(injector.get).toHaveBeenCalledWith(AccountsServer);
      expect(accountsPasswordMock.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('twoFactorSet', () => {
    const code = 'codeTest';
    const secret = 'secretTest';

    it('should throw if no user in context', async () => {
      try {
        await Mutation.twoFactorSet!({}, { code, secret } as any, {} as any, {} as any);
        throw new Error();
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }
    });

    it('should call twoFactor.set', async () => {
      await Mutation.twoFactorSet!(
        {},
        { code, secret } as any,
        { injector, user } as any,
        {} as any
      );
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(accountsPasswordMock.twoFactor.set).toHaveBeenCalledWith(user.id, secret, code);
    });
  });

  describe('twoFactorUnset', () => {
    const code = 'codeTest';

    it('should throw if no user in context', async () => {
      try {
        await Mutation.twoFactorUnset!({}, { code } as any, {} as any, {} as any);
        throw new Error();
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }
    });

    it('should call twoFactor.unset', async () => {
      await Mutation.twoFactorUnset!({}, { code } as any, { injector, user } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(accountsPasswordMock.twoFactor.unset).toHaveBeenCalledWith(user.id, code);
    });
  });

  describe('resetPassword', () => {
    const token = 'tokenTest';
    const newPassword = 'newPasswordTest';

    it('should call resetPassword', async () => {
      await Mutation.resetPassword!(
        {},
        { token, newPassword } as any,
        { injector, ip, userAgent } as any,
        {} as any
      );
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(accountsPasswordMock.resetPassword).toHaveBeenCalledWith(token, newPassword, {
        ip,
        userAgent,
      });
    });
  });

  describe('sendResetPasswordEmail', () => {
    const email = 'emailTest';

    it('should call sendResetPasswordEmail', async () => {
      await Mutation.sendResetPasswordEmail!({}, { email } as any, { injector } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(accountsPasswordMock.sendResetPasswordEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('verifyEmail', () => {
    const token = 'tokenTest';

    it('should call verifyEmail', async () => {
      await Mutation.verifyEmail!({}, { token } as any, { injector } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(accountsPasswordMock.verifyEmail).toHaveBeenCalledWith(token);
    });
  });

  describe('sendVerificationEmail', () => {
    const email = 'emailTest';

    it('should call sendVerificationEmail', async () => {
      await Mutation.sendVerificationEmail!({}, { email } as any, { injector } as any, {} as any);
      expect(injector.get).toHaveBeenCalledWith(AccountsPassword);
      expect(accountsPasswordMock.sendVerificationEmail).toHaveBeenCalledWith(email);
    });
  });
});
