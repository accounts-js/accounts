import { AccountsCode, CodeProvider, ErrorMessages } from '../src';

function createCodeProvider(success: boolean): CodeProvider {
  return {
    sendToClient: jest.fn(() => (success ? Promise.resolve() : Promise.reject())),
  };
}

const errors: ErrorMessages = {
  userNotFound: '0',
  codeExpired: '1',
  codeWasNotFound: '2',
  wrongCode: '3',
  failedToProvideCode: '4',
};

describe('AccountsCode', () => {
  describe('preparation', () => {
    it('throws error when no user is found', async () => {
      const code = new AccountsCode({ codeProvider: createCodeProvider(true), errors });
      const findUserByServiceId = jest.fn(() => Promise.resolve());
      code.setStore({ findUserByServiceId } as any);

      try {
        await code.prepareAuthentication('1234');
      } catch (e) {
        expect(e.message).toEqual(errors.userNotFound);
      }

      expect.assertions(1);
    });

    it('throws error when failed to send code to the client', async () => {
      const code = new AccountsCode({ codeProvider: createCodeProvider(false), errors });

      const user = {
        id: '123',
      };

      const findUserByServiceId = jest.fn(() => Promise.resolve(user));
      const setService = jest.fn(() => Promise.resolve());
      code.setStore({ findUserByServiceId, setService } as any);

      try {
        await code.prepareAuthentication('1234');
      } catch (e) {
        expect(e.message).toEqual(errors.failedToProvideCode);
      }

      expect.assertions(1);
    });

    it('completes successfully', async () => {
      const code = new AccountsCode({ codeProvider: createCodeProvider(true), errors });

      const user = {
        id: '123',
      };

      const findUserByServiceId = jest.fn(() => Promise.resolve(user));
      const setService = jest.fn(() => Promise.resolve());
      code.setStore({ findUserByServiceId, setService } as any);

      const res = await code.prepareAuthentication('1234');

      expect(res).toBeUndefined();
      expect(setService).toHaveBeenCalledTimes(1);
      expect(setService).toHaveBeenCalledWith('123', code.serviceName, {
        id: '1234',
        code: expect.any(String),
        expiry: expect.any(Number),
      });
    });
  });

  describe('Authentication', () => {
    const code = new AccountsCode({ codeProvider: createCodeProvider(true), errors });

    it('throws error when no user is found', async () => {
      const findUserByServiceId = jest.fn(() => Promise.resolve(null));
      code.setStore({ findUserByServiceId } as any);

      try {
        await code.authenticate({ serviceId: '1234', code: '2233' });
      } catch (e) {
        expect(e.message).toEqual(errors.userNotFound);
      }

      expect.assertions(1);
    });

    it('throws error when no code is found', async () => {
      const findUserByServiceId = jest.fn(() =>
        Promise.resolve({
          id: '123',
        })
      );
      code.setStore({ findUserByServiceId } as any);

      try {
        await code.authenticate({ serviceId: '1234', code: '2233' });
      } catch (e) {
        expect(e.message).toEqual(errors.codeWasNotFound);
      }

      expect.assertions(1);
    });

    it('throws error when no code is found 2', async () => {
      const findUserByServiceId = jest.fn(() =>
        Promise.resolve({
          id: '123',
          services: {
            [code.serviceName]: {},
          },
        })
      );
      code.setStore({ findUserByServiceId } as any);

      try {
        await code.authenticate({ serviceId: '1234', code: '2233' });
      } catch (e) {
        expect(e.message).toEqual(errors.codeWasNotFound);
      }

      expect.assertions(1);
    });

    it('throws error when code is wrong', async () => {
      const findUserByServiceId = jest.fn(() =>
        Promise.resolve({
          id: '123',
          services: {
            [code.serviceName]: {
              code: '1111',
            },
          },
        })
      );
      code.setStore({ findUserByServiceId } as any);

      try {
        await code.authenticate({ serviceId: '1234', code: '2233' });
      } catch (e) {
        expect(e.message).toEqual(errors.wrongCode);
      }

      expect.assertions(1);
    });

    it('throws error when code is expired', async () => {
      const findUserByServiceId = jest.fn(() =>
        Promise.resolve({
          id: '123',
          services: {
            [code.serviceName]: {
              code: 'vKw3G1T1mUWhSqSeLkCOXW5NvFk4f12M/GsBXUDVuwI=',
              expiry: Date.now() - 10000,
            },
          },
        })
      );
      code.setStore({ findUserByServiceId } as any);

      try {
        await code.authenticate({ serviceId: '1234', code: '2233' });
      } catch (e) {
        expect(e.message).toEqual(errors.codeExpired);
      }

      expect.assertions(1);
    });

    it('authenticates successfully and returns user', async () => {
      const user = {
        id: '123',
        services: {
          [code.serviceName]: {
            code: 'vKw3G1T1mUWhSqSeLkCOXW5NvFk4f12M/GsBXUDVuwI=',
            expiry: Date.now() + 10000,
          },
        },
      };
      const findUserByServiceId = jest.fn(() => Promise.resolve(user));
      const setService = jest.fn(() => Promise.resolve());
      code.setStore({ findUserByServiceId, setService } as any);

      const res = await code.authenticate({ serviceId: '1234', code: '2233' });

      expect(res).toEqual(user);
      expect(setService).toHaveBeenCalledTimes(1);
      expect(setService).toHaveBeenCalledWith('123', code.serviceName, { id: '1234' });
    });
  });
});
