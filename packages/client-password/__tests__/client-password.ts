import { AccountsClientPassword } from '../src/client-password';

const mockedClient = {
  transport: {
    createUser: jest.fn(),
    sendResetPasswordEmail: jest.fn(),
    resetPassword: jest.fn(),
    sendVerificationEmail: jest.fn(),
    verifyEmail: jest.fn(),
    changePassword: jest.fn(),
  },
  loginWithService: jest.fn(),
};
const accountsPassword = new AccountsClientPassword(mockedClient as any);

const user = {
  email: 'john@doe.com',
  password: 'john',
};

describe('AccountsClientPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(accountsPassword, 'hashPassword');
  });

  it('requires the client', async () => {
    try {
      // tslint:disable-next-line no-unused-expression
      new AccountsClientPassword(null as any);
      throw new Error();
    } catch (err) {
      const { message } = err;
      expect(message).toEqual('A valid client instance is required');
    }
  });

  describe('#options', () => {
    describe('hashPassword', () => {
      it('should use hashPassword option', () => {
        const hashPassword = jest.fn(pass => pass);
        const accountsPasswordTest = new AccountsClientPassword(mockedClient as any, {
          hashPassword,
        });
        const res = accountsPasswordTest.hashPassword('pass');
        expect(hashPassword).toBeCalledWith('pass');
        expect(res).toBe('pass');
      });
    });
  });

  describe('createUser', () => {
    it('should hash password and call transport', async () => {
      await accountsPassword.createUser(user);
      expect(accountsPassword.hashPassword).toBeCalledTimes(1);
      expect(accountsPassword.hashPassword).toBeCalledWith(user.password);
      expect(mockedClient.transport.createUser).toBeCalledTimes(1);
      expect(mockedClient.transport.createUser).toBeCalledWith({
        email: user.email,
        password: user.password,
      });
    });
  });

  describe('login', () => {
    it('should hash password and call client', async () => {
      await accountsPassword.login(user);
      expect(accountsPassword.hashPassword).toBeCalledTimes(1);
      expect(accountsPassword.hashPassword).toBeCalledWith(user.password);
      expect(mockedClient.loginWithService).toBeCalledTimes(1);
      expect(mockedClient.loginWithService).toBeCalledWith('password', {
        email: user.email,
        password: user.password,
      });
    });
  });

  describe('requestPasswordReset', () => {
    it('should call transport', async () => {
      await accountsPassword.requestPasswordReset(user.email);
      expect(mockedClient.transport.sendResetPasswordEmail).toBeCalledWith(user.email);
    });
  });

  describe('resetPassword', () => {
    it('should hash password and call transport', async () => {
      const token = 'tokenTest';
      const newPassword = 'newPasswordTest';
      await accountsPassword.resetPassword(token, newPassword);
      expect(accountsPassword.hashPassword).toBeCalledTimes(1);
      expect(accountsPassword.hashPassword).toBeCalledWith(newPassword);
      expect(mockedClient.transport.resetPassword).toBeCalledTimes(1);
      expect(mockedClient.transport.resetPassword).toBeCalledWith(token, newPassword);
    });
  });

  describe('requestVerificationEmail', () => {
    it('should call transport', async () => {
      await accountsPassword.requestVerificationEmail(user.email);
      expect(mockedClient.transport.sendVerificationEmail).toBeCalledWith(user.email);
    });
  });

  describe('verifyEmail', () => {
    it('should call transport', async () => {
      await accountsPassword.verifyEmail(user.email);
      expect(mockedClient.transport.verifyEmail).toBeCalledWith(user.email);
    });
  });

  describe('changePassword', () => {
    it('should hash password and call transport', async () => {
      const newPassword = 'newPasswordTest';
      await accountsPassword.changePassword(user.password, newPassword);
      expect(accountsPassword.hashPassword).toBeCalledTimes(2);
      expect(accountsPassword.hashPassword).toHaveBeenNthCalledWith(1, user.password);
      expect(accountsPassword.hashPassword).toHaveBeenNthCalledWith(2, newPassword);
      expect(mockedClient.transport.changePassword).toBeCalledTimes(1);
      expect(mockedClient.transport.changePassword).toBeCalledWith(user.password, newPassword);
    });
  });
});
