import AccountsClient from '../src';

const storedAccessToken = 'accessTokenTest';

const userStorage = {
  setUser: jest.fn(()=>null)
}

const defaultResponse = {
  json: async () => defaultResponse
}

const transport = {
  fetch: jest.fn(async ()=>defaultResponse),
  link: () => transport
}

const tokenStorage = {
  getAccessToken: () => storedAccessToken,
  removeTokens: jest.fn(()=>null)
}

const testService = {
  name: 'test',
  link: () => testService
}

const client = new AccountsClient({
  transport,
  userStorage,
  tokenStorage,
  services: [testService]
})

beforeEach(jest.clearAllMocks)

describe('AccountsClient', () => {

  describe('use', () => {

    it('should return the service with matching name', () => {
      expect(client.use('test').name).toBe('test')
    })
    
  })

  describe('refreshTokens', () => {

    it('should call the fetch function of the transport', async () => {
      await client.refreshTokens();
      expect(transport.fetch).toBeCalled()
    })
    
  })

  describe('user', () => {

    it('should call the fetch function of the transport', async () => {
      await client.user();
      expect(transport.fetch).toBeCalled()
    })
    
  })

  describe('impersonate', () => {

    it('should call the fetch function of the transport', async () => {
      await client.impersonate();
      expect(transport.fetch).toBeCalled()
    })
    
  })

  describe('logout', () => {

    it('should call the fetch function of the transport', async () => {
      await client.logout();
      expect(transport.fetch).toBeCalled()
    })

  })

  describe('resumeSession', () => {

    it('should call the fetch function of the transport', async () => {
      await client.resumeSession();
      expect(transport.fetch).toBeCalled()
    })

    it('should return false if no accessToken', async () => {
      storedAccessToken = undefined;
      expect(client.resumeSession()).resolves.toBe(false)
    })

  })

  describe('fetch', () => {

    it('should call the fetch function of the transport', () => {
      client.fetch(1,2);
      expect(transport.fetch).toBeCalledWith(1,2)
    })

  })

  describe('handleResponse', () => {
    
    it('should return the body of the response',async () => {
      const response = { json: () => ({ content: true }) }
      client.handleResponse(response)
      expect((await client.handleResponse(response)).content).toBe(true)
    })

    it('should return the error if the response contains one',async () => {
      const response = { json: () => ({ error: 'error' }) }
      client.handleResponse(response)
      expect((await client.handleResponse(response))).toBe('error')
    })

    it('should set the user if the response contains one',async () => {
      const response = { json: () => ({ user: 'user' }) }
      await client.handleResponse(response)
      expect(userStorage.setUser).toBeCalledWith('user')
    })

  })

})