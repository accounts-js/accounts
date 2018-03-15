import * as speakeasy from 'speakeasy';
import TwoFactor from '../src';

const dbMock: any = {
  findUserById: jest.fn(),
  setService: jest.fn(),
  unsetService: jest.fn(),
};

const mockedUserWithoutTwoFactor: any = {
  services: {},
};

const mockedUserWithTwoFactor: any = {
  services: {
    'two-factor': { secret: {} },
  },
};

const accountsTwoFactor = new TwoFactor({
  appName: 'Accounts-js test',
});
accountsTwoFactor.setStore(dbMock);

describe('TwoFactor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('authenticate', () => {
    it('should throw if code is not set', async () => {
      const code: any = null;
      await expect(
        accountsTwoFactor.authenticate(mockedUserWithoutTwoFactor, code)
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw that 2fa is not set', async () => {
      await expect(
        accountsTwoFactor.authenticate(
          mockedUserWithoutTwoFactor,
          'invalidCode'
        )
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw if invalid code', async () => {
      await expect(
        accountsTwoFactor.authenticate(mockedUserWithTwoFactor, 'invalidCode')
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should authenticate user with 2fa', async () => {
      const spy = jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);
      await accountsTwoFactor.authenticate(
        mockedUserWithTwoFactor,
        'validCode'
      );
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getNewAuthSecret', () => {
    it('should return a new secret', () => {
      const secret = accountsTwoFactor.getNewAuthSecret();
      expect(secret).toBeTruthy();
    });
  });

  describe('set', () => {
    it('should throw if code is not set', async () => {
      const secret = accountsTwoFactor.getNewAuthSecret();
      const code: any = null;
      await expect(
        accountsTwoFactor.set('userId', secret, code)
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw if invalid code', async () => {
      const secret = accountsTwoFactor.getNewAuthSecret();
      await expect(
        accountsTwoFactor.set('userId', secret, 'invalidCode')
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should set two-factor service', async () => {
      const spy = jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);
      await accountsTwoFactor.set('userId', 'secret' as any, 'validCode');
      expect(spy).toHaveBeenCalled();
      expect(dbMock.setService.mock.calls).toMatchSnapshot();
    });
  });

  describe('unset', () => {
    it('should throw if code is not set', async () => {
      const code: any = null;
      await expect(
        accountsTwoFactor.unset('userId', code)
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw that 2fa is not set', async () => {
      dbMock.findUserById.mockImplementation(() =>
        Promise.resolve(mockedUserWithoutTwoFactor)
      );
      await expect(
        accountsTwoFactor.unset('userId', 'invalidCode')
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw if invalid code', async () => {
      dbMock.findUserById.mockImplementation(() =>
        Promise.resolve(mockedUserWithTwoFactor)
      );
      await expect(
        accountsTwoFactor.unset('userId', 'invalidCode')
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should unset two-factor service', async () => {
      dbMock.findUserById.mockImplementation(() =>
        Promise.resolve(mockedUserWithTwoFactor)
      );
      const spy = jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);
      await accountsTwoFactor.unset('userId', 'validCode');
      expect(spy).toHaveBeenCalled();
      expect(dbMock.unsetService.mock.calls).toMatchSnapshot();
    });
  });
});
