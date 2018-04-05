import TokenTransportManager from '../src';

const accessToken = 'accessTokenTest'
const refreshToken = 'refreshTokenTest'

const tokens = { accessToken, refreshToken }

const transportContainer = {
  req: {},
  res: {}
}

class TT {
  public setAccessToken = jest.fn(()=>'true')
  public setRefreshToken = jest.fn(()=>'true')
  public setTokens = jest.fn(()=>'true')
  public getTokens = jest.fn(()=>'true')
  public removeAccessToken = jest.fn(()=>'true')
  public removeRefreshToken = jest.fn(()=>'true')
  public removeTokens = jest.fn(()=>'true')

  constructor(ret){
    this.getAccessToken = jest.fn(()=>ret)
    this.getRefreshToken = jest.fn(()=>ret)
  }
}

const TTa = new TT('true');
const TTb = new TT(false);

const tokenTransportManager = new TokenTransportManager(TTa, TTb)


beforeEach(jest.clearAllMocks)

describe('TokenTransportManager', () => {

  describe('validate configuration', () => {
    
    it('should throw when no tokenTransport provided', () => {
      expect(() => new TokenTransportManager()).toThrow();
    });
    
  });

  describe('constructor', () => {

    it('assign his parameters to a property of itself', () => {
      expect(tokenTransportManager.tokenTransports).toEqual([TTa, TTb]);
    });
    
  });

  describe('setAccessToken', () => {
    
    it('should call the setAccessToken method on each of his tokenTransports', () => {
      tokenTransportManager.setAccessToken(accessToken, transportContainer)
      expect(TTa.setAccessToken).toBeCalled()
      expect(TTb.setAccessToken).toBeCalled()
    })

  })

  describe('setRefreshToken', () => {

    it('should call the setRefreshToken method on each of his tokenTransports', () => {
      tokenTransportManager.setRefreshToken(refreshToken, transportContainer)
      expect(TTa.setRefreshToken).toBeCalled()
      expect(TTb.setRefreshToken).toBeCalled()
    })
    
  })

  describe('setTokens', () => {
    
    it('should call the setAccessToken and setRefreshToken methods on each of his tokenTransports', () => {
      tokenTransportManager.setTokens(tokens, transportContainer)
      expect(TTa.setAccessToken).toBeCalled()
      expect(TTa.setRefreshToken).toBeCalled()
      expect(TTb.setAccessToken).toBeCalled()
      expect(TTb.setRefreshToken).toBeCalled()
    })

  })

  describe('getAccessToken', () => {
    
    it('should call the getAccessToken method on each of his tokenTransports', () => {
      tokenTransportManager.getAccessToken(transportContainer)
      expect(TTa.getAccessToken).toBeCalled()
      expect(TTb.getAccessToken).toBeCalled()
    })

    it('should ignore the results which are not token', () => {
      expect(tokenTransportManager.getAccessToken(transportContainer)).toBe('true')
    })

  })

  describe('getRefreshToken', () => {
    
    it('should call the getRefreshToken method on each of his tokenTransports', () => {
      tokenTransportManager.getRefreshToken(transportContainer)
      expect(TTa.getRefreshToken).toBeCalled()
      expect(TTb.getRefreshToken).toBeCalled()
    })

  })

  describe('getTokens', () => {
    
    it('should call the getAccessToken and getRefreshToken methods on each of his tokenTransports', () => {
      tokenTransportManager.getTokens(tokens, transportContainer)
      expect(TTa.getAccessToken).toBeCalled()
      expect(TTa.getRefreshToken).toBeCalled()
      expect(TTb.getAccessToken).toBeCalled()
      expect(TTb.getRefreshToken).toBeCalled()
    })

  })

  describe('removeAccessToken', () => {
    
    it('should call the removeAccessToken method on each of his tokenTransports', () => {
      tokenTransportManager.removeAccessToken(transportContainer)
      expect(TTa.removeAccessToken).toBeCalled()
      expect(TTb.removeAccessToken).toBeCalled()
    })

  })

  describe('removeRefreshToken', () => {

    it('should call the removeRefreshToken method on each of his tokenTransports', () => {
      tokenTransportManager.removeRefreshToken(transportContainer)
      expect(TTa.removeRefreshToken).toBeCalled()
      expect(TTb.removeRefreshToken).toBeCalled()
    })
    
  })

  describe('removeTokens', () => {
    
    it('should call the removeAccessToken and removeRefreshToken methods on each of his tokenTransports', () => {
      tokenTransportManager.removeTokens(transportContainer)
      expect(TTa.removeAccessToken).toBeCalled()
      expect(TTa.removeRefreshToken).toBeCalled()
      expect(TTb.removeAccessToken).toBeCalled()
      expect(TTb.removeRefreshToken).toBeCalled()
    })

  })
});
