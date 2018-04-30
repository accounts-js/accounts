import {
  changePassword
} from '../../../src/endpoints/password/change-password';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('changePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('changePassword', () => {
    it('calls password.changePassword', async () => {
      const message = 'Email verified';
      const passwordService = {
        changePassword: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = changePassword(accountsServer as any);

      const req = {
        userId: 'userId',
        body: {
          oldPassword: 'oldPassword',
          newPassword: 'newPassword',
        },
      };
      const reqCopy = { ...req };

      await middleware(req, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.changePassword).toBeCalledWith(
        'userId',
        'oldPassword',
        'newPassword'
      );
      expect(res.json).toBeCalled();
      expect(res.status).not.toBeCalled();
    });

    it('Sends error if no userId', async () => {
      const middleware = changePassword(null as any);
      await middleware({} as any, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalled();
    });

    it('Sends error if it was thrown on twoFactorSecret', async () => {
      const error = { message: 'Error' };
      const passwordService = {
        changePassword: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = changePassword(accountsServer as any);
      const req = {
        userId: 'userId',
        body: {
          oldPassword: 'oldPassword',
          newPassword: 'newPassword',
        },
      };
      const reqCopy = { ...req };

      await middleware(req, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.changePassword).toBeCalledWith(
        'userId',
        'oldPassword',
        'newPassword'
      );
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith(error);
    });
  });
});
