import { AccountsMfa } from '../src/accounts-mfa';

describe('AccountsMfa', () => {
  describe('authenticate', () => {
    it('should throw an error if mfaToken is not passed', async () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      await expect(accountsMfa.authenticate({} as any, {})).rejects.toThrowError(
        'Invalid mfa token'
      );
    });
  });

  describe('challenge', () => {
    it('should throw an error if mfaToken is not passed', async () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      await expect(
        accountsMfa.challenge(undefined as any, undefined as any, {})
      ).rejects.toThrowError('Invalid mfa token');
    });
  });

  describe('findUserAuthenticatorsByMfaToken', () => {
    it('should throw an error if mfaToken is not passed', async () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      await expect(
        accountsMfa.findUserAuthenticatorsByMfaToken(undefined as any)
      ).rejects.toThrowError('Invalid mfa token');
    });
  });

  describe('isMfaChallengeValid', () => {
    it('should return false if challenge is deactivated', () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      expect(accountsMfa.isMfaChallengeValid({ deactivated: true } as any)).toBe(false);
    });

    it('should return false if challenge is expired', () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      expect(accountsMfa.isMfaChallengeValid({ createdAt: 100 } as any)).toBe(false);
    });

    it('should return true if challenge is valid', () => {
      const accountsMfa = new AccountsMfa({ factors: {} });
      expect(accountsMfa.isMfaChallengeValid({ createdAt: Date.now() } as any)).toBe(true);
    });
  });
});
