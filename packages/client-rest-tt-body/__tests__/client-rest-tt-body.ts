import ClientRestTTBody from '../src';

const defaultClientRestTTBody = new ClientRestTTBody();

const denyClientRestTTBody = new ClientRestTTBody({
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

describe('ClientRestTTBody', () => {

  describe('constructor', () => {

    it('should provide default configuration', () => {
      expect(defaultClientRestTTBody.accessConfig).toBeDefined()
    })

  })

  describe('setAccessToken', () => {

    it('should set accessToken', () => {
      expect(defaultClientRestTTBody.setAccessToken({}, {}, accessToken)).toEqual([ {}, { accessToken } ])
    })

    it('should not set accessToken if canStore is false', () => {
      expect(denyClientRestTTBody.setAccessToken({}, {}, accessToken)).toEqual([ {}, {} ])
    })

  })

  describe('setRefreshToken', () => {

    it('should set refreshToken', () => {
      expect(defaultClientRestTTBody.setRefreshToken({}, {}, refreshToken)).toEqual([ {}, { refreshToken } ])
    })

    it('should not set refreshToken if canStore is false', () => {
      expect(denyClientRestTTBody.setRefreshToken({}, {}, refreshToken)).toEqual([ {}, {} ])
    })

  })

  describe('setTokens', () => {

    it('should set both Tokens', () => {
      expect(defaultClientRestTTBody.setTokens({},{},tokens)).toEqual([ {}, tokens ])
    })

  })

  describe('getAccessToken', () => {

    it('should get accessToken', () => {
      expect(defaultClientRestTTBody.getAccessToken(response)).resolves.toBe(accessToken)
    })

    it('should return undefined if no accessToken in body', () => {
      expect(defaultClientRestTTBody.getAccessToken(response, {})).resolves.toBe(undefined)
    })

    it('should return undefined if no accessToken in response body', () => {
      expect(defaultClientRestTTBody.getAccessToken(responseNoTokens)).resolves.toBe(undefined)
    })

  })

  describe('getRefreshToken', () => {

    it('should get refreshToken from response body', () => {
      expect(defaultClientRestTTBody.getRefreshToken(response)).resolves.toBe(refreshToken)
    })

    it('should return undefined if no refreshToken in body', () => {
      expect(defaultClientRestTTBody.getRefreshToken(response, {})).resolves.toBe(undefined)
    })

    it('should return undefined if no refreshToken in response body', () => {
      expect(defaultClientRestTTBody.getRefreshToken(responseNoTokens)).resolves.toBe(undefined)
    })

  })

  describe('getTokens', () => {

    it('should get both Tokens', () => {
      expect(defaultClientRestTTBody.getTokens(response)).resolves.toEqual(tokens)
    })

  })

})