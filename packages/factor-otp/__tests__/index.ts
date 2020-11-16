import { authenticator as optlibAuthenticator } from 'otplib';
import { FactorOtp } from '../src';

const factorOtp = new FactorOtp();

const mockedDb = {
  createAuthenticator: jest.fn(() => Promise.resolve('authenticatorIdTest')),
  updateAuthenticator: jest.fn(),
  findAuthenticatorById: jest.fn(),
  findUserAuthenticators: jest.fn(() => [] as any[]),
  createMfaChallenge: jest.fn(),
  updateMfaChallenge: jest.fn(),
};

factorOtp.setStore(mockedDb as any);

describe('FactorOtp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('associate', () => {
    it('create a new mfa challenge when userId is passed', async () => {
      const result = await factorOtp.associate('userIdTest');

      expect(mockedDb.createAuthenticator).toHaveBeenCalledWith({
        type: 'otp',
        userId: 'userIdTest',
        secret: expect.any(String),
        active: false,
      });
      expect(mockedDb.createMfaChallenge).toHaveBeenCalledWith({
        authenticatorId: 'authenticatorIdTest',
        scope: 'associate',
        token: expect.any(String),
        userId: 'userIdTest',
      });
      expect(result).toEqual({
        id: 'authenticatorIdTest',
        mfaToken: expect.any(String),
        secret: expect.any(String),
      });
    });

    it('update mfa challenge when challenge is passed', async () => {
      const result = await factorOtp.associate({
        id: 'mfaChallengeIdTest',
        token: 'mfaChallengeTokenTest',
        userId: 'userIdTest',
      } as any);

      expect(mockedDb.createAuthenticator).toHaveBeenCalledWith({
        type: 'otp',
        userId: 'userIdTest',
        secret: expect.any(String),
        active: false,
      });
      expect(mockedDb.updateMfaChallenge).toHaveBeenCalledWith('mfaChallengeIdTest', {
        authenticatorId: 'authenticatorIdTest',
      });
      expect(result).toEqual({
        id: 'authenticatorIdTest',
        mfaToken: expect.any(String),
        secret: expect.any(String),
      });
    });

    it('update existing authenticator if there is one pending', async () => {
      mockedDb.findUserAuthenticators.mockReturnValue([
        { id: 'authenticatorIdTest', type: 'otp', active: false },
      ]);
      const result = await factorOtp.associate({
        id: 'mfaChallengeIdTest',
        token: 'mfaChallengeTokenTest',
        userId: 'userIdTest',
      } as any);

      expect(mockedDb.updateAuthenticator).toHaveBeenCalledWith('authenticatorIdTest', {
        secret: expect.any(String),
      });
      expect(mockedDb.updateMfaChallenge).toHaveBeenCalledWith('mfaChallengeIdTest', {
        authenticatorId: 'authenticatorIdTest',
      });
      expect(result).toEqual({
        id: 'authenticatorIdTest',
        mfaToken: expect.any(String),
        secret: expect.any(String),
      });
    });
  });

  describe('authenticate', () => {
    it('should throw if code is not provided', async () => {
      await expect(factorOtp.authenticate({} as any, {} as any, {})).rejects.toThrowError(
        'Code required'
      );
    });

    it('should return false if code is invalid to resolve the challenge', async () => {
      const result = await factorOtp.associate('userIdTest');
      const resultAuthenticate = await factorOtp.authenticate(
        {} as any,
        { secret: result.secret } as any,
        {
          code: '1233456',
        }
      );
      expect(resultAuthenticate).toBe(false);
    });

    it('should return true if code is valid', async () => {
      const result = await factorOtp.associate('userIdTest');
      const code = optlibAuthenticator.generate(result.secret);
      const resultAuthentiate = await factorOtp.authenticate(
        {} as any,
        { secret: result.secret } as any,
        {
          code,
        }
      );
      expect(resultAuthentiate).toBe(true);
    });
  });

  describe('sanitize', () => {
    it('should remove the secret property', async () => {
      const authenticator = {
        id: '123',
        secret: 'shouldBeRemoved',
      };
      const result = factorOtp.sanitize(authenticator as any);
      expect(result).toEqual({
        id: authenticator.id,
      });
    });
  });
});
