import CTTRestManager from '../src';

class TokenTransport {
  private name: string;
  constructor(name){
    this.name = name;
    this.setAccessToken = jest.fn(()=>this.name)
    this.setRefreshToken = jest.fn(()=>this.name)
    this.setTokens = jest.fn(()=>this.name)
    this.getAccessToken = jest.fn(()=>this.name)
    this.getRefreshToken = jest.fn(()=>this.name)
    this.getTokens = jest.fn(()=>this.name)
  }
}

const ttA = new TokenTransport('a');
const ttB = new TokenTransport(undefined);

const cttrManager = new CTTRestManager(ttA, ttB);

beforeEach(jest.clearAllMocks)

describe('CTTRestManager', () => {

  describe('setAccessToken', () => {

    it('should call setAccessToken on each TT', async () => {
      await cttrManager.setAccessToken({})
      expect(ttA.setAccessToken).toBeCalled()
      expect(ttB.setAccessToken).toBeCalled()
    })

  })

  describe('setRefreshToken', () => {

    it('should call setRefreshToken on each TT', async () => {
      await cttrManager.setRefreshToken({})
      expect(ttA.setRefreshToken).toBeCalled()
      expect(ttB.setRefreshToken).toBeCalled()
    })

  })
  
  describe('setTokens', () => {

    it('should call setTokens on each TT', async () => {
      await cttrManager.setTokens({})
      expect(ttA.setTokens).toBeCalled()
      expect(ttB.setTokens).toBeCalled()
    })

  })

  describe('getRefreshTokens', () => {

    it('should call getRefreshToken on each TT', async () => {
      await cttrManager.getRefreshToken({})
      expect(ttA.getRefreshToken).toBeCalled()
      expect(ttB.getRefreshToken).toBeCalled()
    })

    it('should keep only truthy values', async () => {
      const result = await cttrManager.getRefreshToken({})
      expect(result).toBe('a')
    })

  })

  describe('getTokens', () => {

    it('should call getAccessToken and getRefreshToken', async () => {
      await cttrManager.getTokens({})
      expect(ttA.getAccessToken).toBeCalled()
      expect(ttA.getRefreshToken).toBeCalled()
    })

  })

})