import CTTRestHeaders from '../src';

const defaultCTTRestHeaders = new CTTRestHeaders();

const denyCTTRestHeaders = new CTTRestHeaders({
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
  headers: {
    get: (param) => tokens[param],
  }
};

describe('ClientRestTTBody', () => {

  describe('constructor', () => {

    it('should provide default configuration', () => {
      expect(defaultCTTRestHeaders.accessConfig).toBeDefined()
    })

  })

  describe('setAccessToken', () => {

    it('should set accessToken', () => {
      expect(defaultCTTRestHeaders.setAccessToken({}, {}, accessToken)).toEqual([ { headers: { accessToken }}, {} ])
    })

    it('should not set accessToken if canStore is false', () => {
      expect(denyCTTRestHeaders.setAccessToken({}, {}, accessToken)).toEqual([ {}, {} ])
    })

  })

  describe('setRefreshToken', () => {

    it('should set refreshToken', () => {
      expect(defaultCTTRestHeaders.setRefreshToken({}, {}, refreshToken)).toEqual([ { headers: { refreshToken }},{}])
    })

    it('should not set refreshToken if canStore is false', () => {
      expect(denyCTTRestHeaders.setRefreshToken({}, {}, refreshToken)).toEqual([ {}, {} ])
    })

  })

  describe('setTokens', () => {

    it('should set both Tokens', () => {
      expect(defaultCTTRestHeaders.setTokens({},{},tokens)).toEqual([ {headers: tokens}, {} ])
    })

  })

  describe('getAccessToken', () => {

    it('should get accessToken', () => {
      expect(defaultCTTRestHeaders.getAccessToken(response)).toBe(accessToken)
    })
    it('should return undefined if no accessToken', () => {
      expect(defaultCTTRestHeaders.getAccessToken({ headers: { get:()=>null }})).toBe(undefined)
    })

  })

  describe('getRefreshToken', () => {

    it('should get refreshToken', () => {
      expect(defaultCTTRestHeaders.getRefreshToken(response)).toBe(refreshToken)
    })

    it('should return undefined if no refreshToken', () => {
      expect(defaultCTTRestHeaders.getRefreshToken({ headers: { get:()=>null }})).toBe(undefined)
    })

  })

  describe('getTokens', () => {

    it('should get both Tokens', () => {
      expect(defaultCTTRestHeaders.getTokens(response)).toEqual(tokens)
    })

  })

})