import { AuthenticatorOtp } from '../src';

const authenticatorOtp = new AuthenticatorOtp();

const mockedDb = {
  createAuthenticator: jest.fn(() => Promise.resolve('authenticatorIdTest')),
  findAuthenticatorById: jest.fn(),
  createMfaChallenge: jest.fn(),
  updateMfaChallenge: jest.fn(),
};

authenticatorOtp.setStore(mockedDb as any);

describe('AuthenticatorOtp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('associate', () => {
    it('create a new mfa challenge when userId is passed', async () => {
      const result = await authenticatorOtp.associate('userIdTest');

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
        otpauthUri: expect.any(String),
      });
    });

    it('update mfa challenge when challenge is passed', async () => {
      const result = await authenticatorOtp.associate({
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
        otpauthUri: expect.any(String),
      });
    });
  });

  describe('sanitize', () => {
    it('should remove the secret property', async () => {
      const authenticator = {
        id: '123',
        secret: 'shouldBeRemoved',
      };
      const result = authenticatorOtp.sanitize(authenticator as any);
      expect(result).toEqual({
        id: authenticator.id,
      });
    });
  });
});
