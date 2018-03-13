import TokenManager from '../src';

const TM = new TokenManager({
  secret: 'test',
  emailTokenExpiration: 60_000,
});

describe('TokenManager', () => {
  describe('validateConfiguration', () => {
    it('should throw if no configuration provided', () => {
      expect(() => {
        new TokenManager();
      }).toThrow();
    });

    it('should throw if configuration does not provide secret property', () => {
      expect(() => {
        new TokenManager({});
      }).toThrow();
    });
  });

  describe('generateRandomToken', () => {
    it('should return a 43 char long random string when no parameters provided', () => {
      expect(typeof TM.generateRandomToken()).toBe('string');
      expect(TM.generateRandomToken().length).toBe(43);
    });

    it('should return random string with the first parameter as length', () => {
      expect(typeof TM.generateRandomToken(10)).toBe('string');
      expect(TM.generateRandomToken().length).toBe(10);
    });
  });

  describe('generateAccessToken', () => {
    it('should throw when no parameters provided', () => {
      expect(() => {
        TM.generateAccessToken();
      }).toThrow();
    });

    it('should return a string when first parameter provided', () => {
      expect(typeof TM.generateRandomToken({ sessionId: 'test' })).toBe(
        'string'
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should return a string', () => {
      expect(typeof TM.generateRandomToken()).toBe('string');
      expect(typeof TM.generateRandomToken({ sessionId: 'test' })).toBe(
        'string'
      );
    });
  });

  describe('isEmailTokenExpired', () => {
    it('should return true if the token provided is not expired', () => {
      expect(TM.isEmailTokenExpired({ when: 0 })).toBe(true);
      expect(TM.isEmailTokenExpired({ when: Date.now() + 100_000 })).toBe(
        false
      );
    });
  });

  describe('decodeToken', () => {
    it('should return the decoded token', () => {
      const tokenData = { user: 'test' };
      const token = TM.generateAccessToken(tokenData);
      TM.decodeToken(token, true).then(decodedToken => {
        expect(decodedToken.data.user).toBe('test');
      });
    });
  });
});
