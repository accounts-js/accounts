import { resetPassword, sendResetPasswordEmail } from '../../../src/endpoints/password/reset';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('resetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resetPassword', () => {
    it('calls password.resetPassword and returns a message', async () => {
      const passwordService = {
        resetPassword: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = resetPassword(accountsServer as any);

      const req = {
        body: {
          token: 'token',
          newPassword: 'new-password',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.resetPassword).toHaveBeenCalledWith(
        'token',
        'new-password',
        { ip: null, userAgent: '' }
      );
      expect(res.json).toHaveBeenCalledWith(null);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('Sends error if it was thrown on resetPassword', async () => {
      const error = { message: 'Could not reset password' };
      const passwordService = {
        resetPassword: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = resetPassword(accountsServer as any);
      const req = {
        body: {
          token: 'token',
          newPassword: 'new-password',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.resetPassword).toHaveBeenCalledWith(
        'token',
        'new-password',
        { ip: null, userAgent: '' }
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('calls password.sendResetPasswordEmail and returns a message', async () => {
      const passwordService = {
        sendResetPasswordEmail: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = sendResetPasswordEmail(accountsServer as any);

      const req = {
        body: {
          email: 'email',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.sendResetPasswordEmail).toHaveBeenCalledWith(
        'email'
      );
      expect(res.json).toHaveBeenCalledWith(null);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('Sends error if it was thrown on sendResetPasswordEmail', async () => {
      const error = { message: 'Could not send reset password' };
      const passwordService = {
        sendResetPasswordEmail: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = sendResetPasswordEmail(accountsServer as any);
      const req = {
        body: {
          email: 'email',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.sendResetPasswordEmail).toHaveBeenCalledWith(
        'email'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
