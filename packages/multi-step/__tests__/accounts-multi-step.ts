import { AuthenticationService } from '@accounts/types';

import { createToken } from '../src/utils/crypto';
import { AccountsMultiStep, ErrorMessages } from '../src';

const errors: ErrorMessages = {
  notEnoughAuthenticationServices: '0',
  userNotFound: '1',
  serviceIdNotProvided: '2',
  wrongStep: '3',
  notReadyForAuthentication: '4',
  wrongToken: '5',
};

function createStep(promise: Promise<any>): AuthenticationService {
  return {
    server: {},
    serviceName: '',
    setStore: () => jest.fn(),
    authenticate: jest.fn(() => promise),
  };
}

describe('AccountsMultiStep', () => {
  describe('creation', () => {
    it('throws error when creating authenticator with no steps', () => {
      expect(() => {
        // tslint:disable-next-line: no-unused-expression
        new AccountsMultiStep([] as any, { errors });
      }).toThrowError(errors.notEnoughAuthenticationServices);
    });

    it('throws error when creating authenticator with one step', () => {
      expect(() => {
        // tslint:disable-next-line: no-unused-expression
        new AccountsMultiStep([1] as any, { errors });
      }).toThrowError(errors.notEnoughAuthenticationServices);
    });

    it('creates authenticator with two steps', () => {
      expect(() => {
        // tslint:disable-next-line: no-unused-expression
        new AccountsMultiStep([1, 2] as any, { errors });
      }).not.toThrowError(errors.notEnoughAuthenticationServices);
    });
  });

  describe('firstAuthenticationStep', () => {
    it('failed first step', async () => {
      const multiStep = new AccountsMultiStep([
        createStep(Promise.reject(new Error())),
        createStep(Promise.resolve()),
      ]);

      try {
        await multiStep.authenticateStep({ index: 0 });
      } catch (e) {
        expect(e).toEqual(new Error());
      }

      expect.assertions(1);
    });

    it('no user for first step', async () => {
      const multiStep = new AccountsMultiStep(
        [createStep(Promise.resolve(null)), createStep(Promise.resolve())],
        { errors }
      );

      try {
        await multiStep.authenticateStep({ index: 0 });
      } catch (e) {
        expect(e).toEqual(new Error(errors.userNotFound));
      }

      expect.assertions(1);
    });

    it('continues to the next step upon successful first step', async () => {
      const user = {
        id: '123',
      };
      const multiStep = new AccountsMultiStep([
        createStep(Promise.resolve(user)),
        createStep(Promise.resolve()),
      ]);
      const setService = jest.fn(() => Promise.resolve());
      multiStep.setStore({ setService } as any);

      const res = await multiStep.authenticateStep({ index: 0 });

      expect(res.nextStep).toEqual(1);
      expect(res.serviceId).toBeDefined();
      expect(res.token).toBeUndefined();
      expect(setService).toHaveBeenCalledTimes(1);
      expect(setService).toHaveBeenCalledWith('123', multiStep.serviceName, {
        id: expect.any(String),
        nextStep: 1,
      });
    });
  });

  describe('intermidiateAuthenticationStep', () => {
    it('throws error when no serviceId is provided to step', async () => {
      const multiStep = new AccountsMultiStep(
        [
          createStep(Promise.resolve()),
          createStep(Promise.resolve()),
          createStep(Promise.resolve()),
        ],
        { errors }
      );

      try {
        await multiStep.authenticateStep({ index: 1 });
      } catch (e) {
        expect(e).toEqual(new Error(errors.serviceIdNotProvided));
      }

      expect.assertions(1);
    });

    it('throws error when no user is found for serviceId', async () => {
      const multiStep = new AccountsMultiStep(
        [
          createStep(Promise.resolve()),
          createStep(Promise.resolve()),
          createStep(Promise.resolve()),
        ],
        { errors }
      );
      const findUserByServiceId = jest.fn(() => Promise.resolve());
      multiStep.setStore({ findUserByServiceId } as any);

      try {
        await multiStep.authenticateStep({ index: 1, serviceId: '1234' });
      } catch (e) {
        expect(e).toEqual(new Error(errors.userNotFound));
      }

      expect.assertions(1);
    });

    it('throws error when provided next step is not what is expected', async () => {
      const multiStep = new AccountsMultiStep(
        [
          createStep(Promise.resolve()),
          createStep(Promise.resolve()),
          createStep(Promise.resolve()),
        ],
        { errors }
      );
      const findUserByServiceId = jest.fn(() =>
        Promise.resolve({
          id: '123',
          services: {
            [multiStep.serviceName]: {
              nextStep: 2,
            },
          },
        })
      );
      multiStep.setStore({ findUserByServiceId } as any);

      try {
        await multiStep.authenticateStep({ index: 1, serviceId: '1234', nextStep: 1 });
      } catch (e) {
        expect(e).toEqual(new Error(errors.wrongStep));
      }

      expect.assertions(1);
    });

    it('throws error when authentication step is failed', async () => {
      const multiStep = new AccountsMultiStep([
        createStep(Promise.resolve()),
        createStep(Promise.reject(new Error())),
        createStep(Promise.resolve()),
      ]);
      const findUserByServiceId = jest.fn(() =>
        Promise.resolve({
          id: '123',
          services: {
            [multiStep.serviceName]: {
              nextStep: 1,
            },
          },
        })
      );
      multiStep.setStore({ findUserByServiceId } as any);

      try {
        await multiStep.authenticateStep({ index: 1, serviceId: '1234', nextStep: 1 });
      } catch (e) {
        expect(e).toEqual(new Error());
      }

      expect.assertions(1);
    });

    it('throws error when authentication step returns null', async () => {
      const multiStep = new AccountsMultiStep(
        [
          createStep(Promise.resolve()),
          createStep(Promise.resolve(null)),
          createStep(Promise.resolve()),
        ],
        { errors }
      );
      const findUserByServiceId = jest.fn(() =>
        Promise.resolve({
          id: '123',
          services: {
            [multiStep.serviceName]: {
              nextStep: 1,
            },
          },
        })
      );
      multiStep.setStore({ findUserByServiceId } as any);

      try {
        await multiStep.authenticateStep({ index: 1, serviceId: '1234', nextStep: 1 });
      } catch (e) {
        expect(e).toEqual(new Error(errors.userNotFound));
      }

      expect.assertions(1);
    });

    it('returns next step upon successful authentication', async () => {
      const user = {
        id: 123,
      };
      const multiStep = new AccountsMultiStep([
        createStep(Promise.resolve()),
        createStep(Promise.resolve(user)),
        createStep(Promise.resolve()),
      ]);
      const setService = jest.fn(() => Promise.resolve({}));
      const findUserByServiceId = jest.fn(() =>
        Promise.resolve({
          ...user,
          services: {
            [multiStep.serviceName]: {
              nextStep: 1,
            },
          },
        })
      );
      multiStep.setStore({ setService, findUserByServiceId } as any);

      const res = await multiStep.authenticateStep({ index: 1, serviceId: '1234' });

      expect(res.nextStep).toEqual(2);
      expect(res.serviceId).toEqual('1234');
      expect(res.token).toBeUndefined();
    });
  });

  describe('finalAuthenticationStep', () => {
    it('throws error when no serviceId is provided to final step', async () => {
      const multiStep = new AccountsMultiStep(
        [createStep(Promise.resolve()), createStep(Promise.resolve())],
        { errors }
      );

      try {
        await multiStep.authenticateStep({ index: 1 });
      } catch (e) {
        expect(e).toEqual(new Error(errors.serviceIdNotProvided));
      }

      expect.assertions(1);
    });

    it('stores the hashedToken and returns successful result', async () => {
      const user = {
        id: '123',
      };
      const multiStep = new AccountsMultiStep([
        createStep(Promise.resolve()),
        createStep(Promise.resolve(user)),
      ]);

      const userWithService = {
        ...user,
        services: {
          [multiStep.serviceName]: {
            id: '1234',
            nextStep: 1,
          },
        },
      };

      const setService = jest.fn(() => Promise.resolve({}));
      const findUserByServiceId = jest.fn(() => Promise.resolve(userWithService));
      multiStep.setStore({ setService, findUserByServiceId } as any);

      const res = await multiStep.authenticateStep({ index: 1, serviceId: '1234' });

      expect(res.nextStep).toBeUndefined();
      expect(res.serviceId).toBe('1234');
      expect(res.token).toBeDefined();
      expect(setService).toHaveBeenCalledTimes(1);
      expect(setService).toHaveBeenCalledWith('123', multiStep.serviceName, {
        id: '1234',
        hashedToken: expect.any(String),
      });
    });
  });

  describe('finishAuthentication', () => {
    const multiStep = new AccountsMultiStep([1, 2] as any, { errors });

    it('throws error when no user is found for params', async () => {
      const findUserByServiceId = jest.fn(() => Promise.resolve(null));
      multiStep.setStore({ findUserByServiceId } as any);

      try {
        await multiStep.authenticate({ serviceId: '', token: '' });
      } catch (e) {
        expect(e).toEqual(new Error(errors.userNotFound));
      }

      expect.assertions(1);
    });

    it('throws error when no token is found for params', async () => {
      const user = {
        id: '123',
        services: {
          [multiStep.serviceName]: {},
        },
      };
      const findUserByServiceId = jest.fn(() => Promise.resolve(user));
      multiStep.setStore({ findUserByServiceId } as any);

      try {
        await multiStep.authenticate({ serviceId: '', token: '' });
      } catch (e) {
        expect(e).toEqual(new Error(errors.notReadyForAuthentication));
      }

      expect.assertions(1);
    });

    it('throws error when token is invalid', async () => {
      const user = {
        id: '123',
        services: {
          [multiStep.serviceName]: {
            hashedToken: '123',
          },
        },
      };
      const findUserByServiceId = jest.fn(() => Promise.resolve(user));
      multiStep.setStore({ findUserByServiceId } as any);

      try {
        await multiStep.authenticate({ serviceId: '', token: '1234' });
      } catch (e) {
        expect(e).toEqual(new Error(errors.wrongToken));
      }

      expect.assertions(1);
    });

    it('returns user upon successful authentication', async () => {
      const { token, hash } = createToken();
      const user = {
        id: '123',
        services: {
          [multiStep.serviceName]: {
            hashedToken: hash,
          },
        },
      };
      const findUserByServiceId = jest.fn(() => Promise.resolve(user));
      multiStep.setStore({ findUserByServiceId } as any);

      const foundUser = await multiStep.authenticate({ serviceId: '', token });

      expect(foundUser).toEqual(user);
    });
  });
});
