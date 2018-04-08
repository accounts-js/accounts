import ClientRestTTHeaders from '../src';

const defaultClientRestTTHeaders = new ClientRestTTHeaders();

const denyClientRestTTHeaders = new ClientRestTTHeaders({
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
      expect(defaultClientRestTTHeaders.accessConfig).toBeDefined()
    })

  })

  describe('setAccessToken', () => {

    it('should set accessToken', () => {
      expect(defaultClientRestTTHeaders.setAccessToken({}, {}, accessToken)).toEqual([ { headers: { accessToken }}, {} ])
    })

    it('should not set accessToken if canStore is false', () => {
      expect(denyClientRestTTHeaders.setAccessToken({}, {}, accessToken)).toEqual([ {}, {} ])
    })

  })

  describe('setRefreshToken', () => {

    it('should set refreshToken', () => {
      expect(defaultClientRestTTHeaders.setRefreshToken({}, {}, refreshToken)).toEqual([ { headers: { refreshToken }},{}])
    })

    it('should not set refreshToken if canStore is false', () => {
      expect(denyClientRestTTHeaders.setRefreshToken({}, {}, refreshToken)).toEqual([ {}, {} ])
    })

  })

  describe('setTokens', () => {

    it('should set both Tokens', () => {
      expect(defaultClientRestTTHeaders.setTokens({},{},tokens)).toEqual([ {headers: tokens}, {} ])
    })

  })

  describe('getAccessToken', () => {

    it('should get accessToken', () => {
      expect(defaultClientRestTTHeaders.getAccessToken(response)).toBe(accessToken)
    })
    it('should return undefined if no accessToken', () => {
      expect(defaultClientRestTTHeaders.getAccessToken({ headers: { get:()=>null }})).toBe(undefined)
    })

  })

  describe('getRefreshToken', () => {

    it('should get refreshToken', () => {
      expect(defaultClientRestTTHeaders.getRefreshToken(response)).toBe(refreshToken)
    })

    it('should return undefined if no refreshToken', () => {
      expect(defaultClientRestTTHeaders.getRefreshToken({ headers: { get:()=>null }})).toBe(undefined)
    })

  })

  describe('getTokens', () => {

    it('should get both Tokens', () => {
      expect(defaultClientRestTTHeaders.getTokens(response)).toEqual(tokens)
    })

  })

})