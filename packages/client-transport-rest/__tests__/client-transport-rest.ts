import ClientTransportRest from '../src';

const accessToken = 'accessTokenTest';
const refreshToken = 'refreshTokenTest';
const tokens = { accessToken, refreshToken };

const response = {
  json: jest.fn(async () => ({ body: true })),
  clone: jest.fn(()=>response)
}

const fetch = jest.fn(async()=>response)
global.fetch = fetch;

const tokenTransport = {
  getTokens: jest.fn(()=>tokens),
  setTokens: jest.fn((config, body, t) => [config, body] )
}

const client = {
  tokenStorage: {
    getTokens: jest.fn(()=>tokens),
    setTokens: jest.fn(() =>null)
  }
}

const CTR = new ClientTransportRest({
  tokenTransport
})

CTR.link(client);

describe('ClientTransportRest', () => {

  describe('fetch', () => {

    it('should get tokens from client', () => {
      CTR.fetch(['a'],{});
      expect(client.tokenStorage.getTokens).toBeCalled()
    })

    it('should set tokens to request', () => {
      CTR.fetch(['a'],{});
      expect(tokenTransport.setTokens).toBeCalled()
    })

    it('should fetch the server', () => {
      CTR.fetch(['a'],{});
      expect(fetch).toBeCalled()
    })

    it('should get tokens from response', () => {
      CTR.fetch(['a'],{});
      expect(tokenTransport.getTokens).toBeCalledWith(response)
    })

    it('should set tokens to client', () => {
      CTR.fetch(['a'],{});
      expect(client.tokenStorage.setTokens).toBeCalledWith(tokens)
    })

  })

  describe('getDefaultFetchConfig', () => {

    it('should return an object', () => {

      expect(typeof CTR.getDefaultFetchConfig()).toBe('object')

    })

  })

})