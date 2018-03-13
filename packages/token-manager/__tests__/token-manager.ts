import TokenManager from '../src';

const TM = new TokenManager({
  secret: 'test',
  emailTokenExpiration: 60_000,
});

describe('TokenManager', () => {
  describe('validateConfiguration', () => {
    it('should throw if no configuration provided', () => {
      expect(() => { new TokenManager(); }).toThrow();
    });

    it('should throw if configuration does not provide secret property', () => {
      expect(() => {
        new TokenManager({});
      }).toThrow();
    });
  });

  describe('generateRandomToken', () => {
    it('should return a 86 char (43 bytes to hex) long random string when no parameters provided', () => {
      expect(typeof TM.generateRandomToken()).toBe('string');
      expect(TM.generateRandomToken().length).toBe(86);
    });

    it('should return random string with the first parameter as length', () => {
      expect(typeof TM.generateRandomToken(10)).toBe('string');
      expect(TM.generateRandomToken(10).length).toBe(20);
    });
  });

  describe('generateAccessToken', () => {
    it('should throw when no parameters provided', () => {
      expect(() => {
        TM.generateAccessToken();
      }).toThrow();
    });

    it('should return a string when first parameter provided', () => {
      expect(typeof TM.generateAccessToken({ sessionId: 'test' })).toBe('string');
    });
  });

  describe('generateRefreshToken', () => {
    it('should return a string', () => {
      expect(typeof TM.generateRefreshToken()).toBe('string');
      expect(typeof TM.generateRefreshToken({ sessionId: 'test' })).toBe('string');
    });
  });

  describe('isEmailTokenExpired', () => {
    it('should return true if the token provided is expired', () => {
      const token = '';
      const tokenRecord = { when: 0 };
      expect(TM.isEmailTokenExpired(token, tokenRecord)).toBe(true);
    });

    it('should return false if the token provided is not expired', () => {
      const token = '';
      const tokenRecord = { when: Date.now() + 100_000 };
      expect(TM.isEmailTokenExpired(token, tokenRecord)).toBe(false);
    });

  });

  describe('decodeToken', () => {
    const TMdecode = new TokenManager({
      secret: 'test',
      access: {
        expiresIn: '0s'
      }
    })

    it('should not ignore expiration by default', () => {
      const tokenData = { user: 'test' };
      const token = TMdecode.generateAccessToken(tokenData);
      expect(()=>{TMdecode.decodeToken(token)}).toThrow();
    });
    it('should return the decoded token anyway when ignoreExpiration is true', () => {
      const tokenData = { user: 'test' };
      const token = TMdecode.generateAccessToken(tokenData);
      expect(TMdecode.decodeToken(token, true).user).toBe('test');
    });
  });
});
