import { addEmail } from '../../../src/endpoints/password/add-email';

const res: any = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe('addEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addEmail', () => {
    it('calls password.addEmail', async () => {
      const passwordService = {
        addEmail: jest.fn(() => null),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = addEmail(accountsServer as any);

      const req = {
        userId: 'userId',
        body: {
          newEmail: 'newEmail',
        },
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.addEmail).toHaveBeenCalledWith(
        'userId',
        'newEmail'
      );
      expect(res.json).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('Sends error if no userId', async () => {
      const middleware = addEmail(null as any);
      await middleware({} as any, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
    });

    it('Sends error if it was thrown on addEmail', async () => {
      const error = { message: 'Error' };
      const passwordService = {
        addEmail: jest.fn(() => {
          throw error;
        }),
      };
      const accountsServer = {
        getServices: () => ({
          password: passwordService,
        }),
      };
      const middleware = addEmail(accountsServer as any);
      const req = {
        userId: 'userId',
        body: {
          newEmail: 'newEmail',
        },
      };
      const reqCopy = { ...req };

      await middleware(req as any, res);

      expect(req).toEqual(reqCopy);
      expect(accountsServer.getServices().password.addEmail).toHaveBeenCalledWith(
        'userId',
        'newEmail'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
