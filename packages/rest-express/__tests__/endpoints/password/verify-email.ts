import {
  verifyEmail,
  sendVerificationEmail,
} from '../../../src/endpoints/password/verify-email';

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('verifyEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyEmail', () => {
    it('calls password.verifyEmail and returns a message', async () => {
      const message = 'Email verified';
      const passwordService = {
        verifyEmail: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = verifyEmail(accountsServer as any);

      const req = {
        body: {
          token: 'token',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.verifyEmail).toBeCalledWith(
        'token'
      );
      expect(res.json).toBeCalledWith({ message });
      expect(res.status).not.toBeCalled();
    });

    it('Sends error if it was thrown on verifyEmail', async () => {
      const error = { message: 'Could not verify email' };
      const passwordService = {
        verifyEmail: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = verifyEmail(accountsServer as any);
      const req = {
        body: {
          token: 'token',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.verifyEmail).toBeCalledWith(
        'token'
      );
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith(error);
    });
  });

  describe('sendVerificationEmail', () => {
    it('calls password.sendVerificationEmail and returns a message', async () => {
      const message = 'Email sent';
      const passwordService = {
        sendVerificationEmail: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = sendVerificationEmail(accountsServer as any);

      const req = {
        body: {
          email: 'email',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req, res);

      expect(req).toEqual(reqCopy);
      expect(
        accountsServer.getServices().password.sendVerificationEmail
      ).toBeCalledWith('email');
      expect(res.json).toBeCalledWith({ message });
      expect(res.status).not.toBeCalled();
    });

    it('Sends error if it was thrown on sendVerificationEmail', async () => {
      const error = { message: 'Could not send verification email' };
      const passwordService = {
        sendVerificationEmail: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = sendVerificationEmail(accountsServer as any);
      const req = {
        body: {
          email: 'email',
        },
        headers: {},
      };
      const reqCopy = { ...req };

      await middleware(req, res);

      expect(req).toEqual(reqCopy);
      expect(
        accountsServer.getServices().password.sendVerificationEmail
      ).toBeCalledWith('email');
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith(error);
    });
  });
});
