import CTSLocalStorage from '../src';

const accessToken = 'accessTokenTest';
const refreshToken = 'refreshTokenTest';
const tokens = { accessToken, refreshToken };

const cts = new CTSLocalStorage();

class MockLocalStorage {

  public store = {};

  public setItem(key, value){
    this.store[key] = value
  }

  public removeItem(key){
    delete this.store[key]
  }

  public getItem = (key) => this.store[key]

  public reset(){
    this.store = {}
  }
}

const localStorage = new MockLocalStorage()

global.localStorage = localStorage

beforeEach(localStorage.reset)

describe('CTSLocalStorage', () => {

  describe('setAccessToken', () => {

    it('should set accessToken if valid token', () => {
      cts.setAccessToken(accessToken);
      expect(localStorage.getItem('accessToken')).toEqual(accessToken)
    })

    it('should not set accessToken if invalid token', () => {
      localStorage.reset()
      cts.setAccessToken('');
      expect(localStorage.getItem('accessToken')).toEqual(undefined)
    })

  })

  describe('setRefreshToken', () => {

    it('should set refreshToken if valid token', () => {
      cts.setRefreshToken(refreshToken);
      expect(localStorage.getItem('refreshToken')).toEqual(refreshToken)
    })

    it('should not set refreshToken if invalid token', () => {
      localStorage.reset()
      cts.setRefreshToken(['']);
      expect(localStorage.getItem('refreshToken')).toEqual(undefined)
    })

  })

  describe('setTokens', () => {

    it('should set both tokens', () => {
      cts.setTokens(tokens)
      expect(localStorage.getItem('accessToken')).toEqual(accessToken)
      expect(localStorage.getItem('refreshToken')).toEqual(refreshToken)
    })

  })


  describe('getAccessToken', () => {

    it('should get accessToken if present', () => {
      localStorage.setItem('accessToken', accessToken);
      expect(cts.getAccessToken()).toEqual(accessToken)
    })

    it('should return undefined if not present', () => {
      localStorage.reset()
      expect(cts.getAccessToken()).toEqual(undefined)
    })

  })

  describe('getRefreshToken', () => {

    it('should get refreshToken if present', () => {
      localStorage.setItem('refreshToken', refreshToken);
      expect(cts.getRefreshToken()).toEqual(refreshToken)
    })

    it('should return undefined if not present', () => {
      localStorage.reset()
      expect(cts.getRefreshToken()).toEqual(undefined)
    })

  })

  describe('getTokens', () => {

    it('should get both tokens', () => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      expect(cts.getTokens()).toEqual(tokens)
    })

  })


  describe('removeAccessToken', () => {

    it('should remove accessToken', () => {
      localStorage.setItem('accessToken', accessToken);
      cts.removeAccessToken();
      expect(localStorage.getItem('accessToken')).toBe(undefined)
    })
    
  })

  describe('removeRefreshToken', () => {

    it('should remove refreshToken', () => {
      localStorage.setItem('refreshToken', refreshToken);
      cts.removeRefreshToken();
      expect(localStorage.getItem('refreshToken')).toBe(undefined)
    })
    
  })

  describe('removeTokens', () => {

    it('should remove both tokens', () => {
      localStorage.setItem('accessToken', accessToken);      
      localStorage.setItem('refreshToken', refreshToken);
      cts.removeTokens();
      expect(localStorage.getItem('accessToken')).toBe(undefined)
      expect(localStorage.getItem('refreshToken')).toBe(undefined)
    })
    
  })

  describe('checkToken', () => {

    it('should return false if token is not string', () => {
      expect(cts.checkToken([])).toBe(false)
    })

    it('should return false if token length < 5', () => {
      expect(cts.checkToken('test')).toBe(false)
    })

    it('should return true if all conditions pass', () => {
      expect(cts.checkToken('hello')).toBe(true)
    })

  })

})