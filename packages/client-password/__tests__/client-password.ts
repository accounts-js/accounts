import ClientPassword from '../src';

const client = {
  fetch: jest.fn()
}

const cp = new ClientPassword()
cp.link(client)

beforeEach(jest.clearAllMocks)

describe('ClientPassword', () => {

  it('should be named password', () => {
    expect(cp.name).toBe('password')
  })

  describe('login', () => {

    it('should call client.fetch', () => {
      cp.login({ username: 'aaa', email: 'aaa', password: 'aaa'})
      expect(client.fetch).toBeCalled()
    })
  
  })

  describe('register', () => {

    it('should call client.fetch', () => {
      cp.register({ username: 'aaa', email: 'aaa', password: 'aaa'})
      expect(client.fetch).toBeCalled()
    })
  
  })

})