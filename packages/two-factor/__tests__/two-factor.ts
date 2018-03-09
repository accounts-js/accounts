import * as speakeasy from 'speakeasy';
import { TwoFactor } from '../src/two-factor';

const dbMock: any = {
  findUserById: jest.fn(),
  setService: jest.fn(),
  unsetService: jest.fn(),
};

const mockedUserWithoutTwoFactor = {
  services: {}
}

const mockedUserWithTwoFactor = {
  services: {
    'two-factor': { secret: {} }
  }
}

const accountsTwoFactor = new TwoFactor({
  appName: 'Accounts-js test',
});
accountsTwoFactor.setStore(dbMock);

describe('TwoFactor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getNewAuthSecret', () => {
    it('should return a new secret', () => {
      const secret = accountsTwoFactor.getNewAuthSecret();
      expect(secret).toBeTruthy();
    });
  });

  describe('set', () => {
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
    it('should throw that 2fa is not set', async () => {
      dbMock.findUserById.mockImplementation(() => Promise.resolve(mockedUserWithoutTwoFactor));
      await expect(
        accountsTwoFactor.unset('userId', 'invalidCode')
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw if invalid code', async () => {
      dbMock.findUserById.mockImplementation(() => Promise.resolve(mockedUserWithTwoFactor));
      await expect(
        accountsTwoFactor.unset('userId', 'invalidCode')
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should unset two-factor service', async () => {
      dbMock.findUserById.mockImplementation(() => Promise.resolve(mockedUserWithTwoFactor));
      const spy = jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);
      await accountsTwoFactor.unset('userId', 'validCode');
      expect(spy).toHaveBeenCalled();
      expect(dbMock.unsetService.mock.calls).toMatchSnapshot();
      spy.mockRestore();
    });
  });
});
