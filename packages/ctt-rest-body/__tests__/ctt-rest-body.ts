import CTTRestBody from '../src';

const defaultCTTRestBody = new CTTRestBody();

const denyCTTRestBody = new CTTRestBody({
  access: {
    canStore: false
  },
  refresh: {
    canStore: false
  }
});

const accessToken = 'accessTokenTest';
const refreshToken = 'refreshTokenTest';

const tokens = { accessToken, refreshToken };

const response = {
  json: () => tokens
};

const responseNoTokens = {
  json: () => ({})
};

describe('CTTRestBody', () => {

  describe('constructor', () => {

    it('should provide default configuration', () => {
      expect(defaultCTTRestBody.accessConfig).toBeDefined()
    })

  })

  describe('setAccessToken', () => {

    it('should set accessToken', () => {
      expect(defaultCTTRestBody.setAccessToken({}, {}, accessToken)).toEqual([ {}, { accessToken } ])
    })

    it('should not set accessToken if canStore is false', () => {
      expect(denyCTTRestBody.setAccessToken({}, {}, accessToken)).toEqual([ {}, {} ])
    })

  })

  describe('setRefreshToken', () => {

    it('should set refreshToken', () => {
      expect(defaultCTTRestBody.setRefreshToken({}, {}, refreshToken)).toEqual([ {}, { refreshToken } ])
    })

    it('should not set refreshToken if canStore is false', () => {
      expect(denyCTTRestBody.setRefreshToken({}, {}, refreshToken)).toEqual([ {}, {} ])
    })

  })

  describe('setTokens', () => {

    it('should set both Tokens', () => {
      expect(defaultCTTRestBody.setTokens({},{},tokens)).toEqual([ {}, tokens ])
    })

  })

  describe('getAccessToken', () => {

    it('should get accessToken', () => {
      expect(defaultCTTRestBody.getAccessToken(response)).resolves.toBe(accessToken)
    })

    it('should return undefined if no accessToken in body', () => {
      expect(defaultCTTRestBody.getAccessToken(response, {})).resolves.toBe(undefined)
    })

    it('should return undefined if no accessToken in response body', () => {
      expect(defaultCTTRestBody.getAccessToken(responseNoTokens)).resolves.toBe(undefined)
    })

  })

  describe('getRefreshToken', () => {

    it('should get refreshToken from response body', () => {
      expect(defaultCTTRestBody.getRefreshToken(response)).resolves.toBe(refreshToken)
    })

    it('should return undefined if no refreshToken in body', () => {
      expect(defaultCTTRestBody.getRefreshToken(response, {})).resolves.toBe(undefined)
    })

    it('should return undefined if no refreshToken in response body', () => {
      expect(defaultCTTRestBody.getRefreshToken(responseNoTokens)).resolves.toBe(undefined)
    })

  })

  describe('getTokens', () => {

    it('should get both Tokens', () => {
      expect(defaultCTTRestBody.getTokens(response)).resolves.toEqual(tokens)
    })

  })

})