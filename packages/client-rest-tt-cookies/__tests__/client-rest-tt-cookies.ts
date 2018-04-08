import ClientRestTTCookies from '../src';

const defaultClientRestTTCookies = new ClientRestTTCookies();

const denyClientRestTTCookies = new ClientRestTTCookies({
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

class MockCookie {
  private str = '';

  get cookie(){
    return this.str;
  }

  set cookie(s){
    this.str += (this.str ? ';' : '') + s;
  }

  public reset(){
    this.str = ''
  }
}


const mockcookie = new MockCookie()


global.document = {};

document.__defineGetter__('cookie', ()=>mockcookie.cookie);
document.__defineSetter__('cookie', (s)=> {mockcookie.cookie = s});


beforeEach(() => {
  mockcookie.reset();
})


describe('ClientRestTTBody', () => {

  describe('setAccessToken', () => {

    it('should set accessToken', () => {
      defaultClientRestTTCookies.setAccessToken({}, {}, accessToken);
      expect(mockcookie.str).toMatchSnapshot()
    })

    it('should not set accessToken if canStore is false', () => {
      denyClientRestTTCookies.setAccessToken({}, {}, accessToken)
      expect(mockcookie.str).toBe('')
    })

  })

  describe('setRefreshToken', () => {

    it('should set refreshToken', () => {
      defaultClientRestTTCookies.setRefreshToken({}, {}, refreshToken)
      expect(mockcookie.str).toMatchSnapshot()
    })

    it('should not set refreshToken if canStore is false', () => {
      denyClientRestTTCookies.setRefreshToken({}, {}, refreshToken)
      expect(mockcookie.str).toBe('')
    })

  })

  describe('setTokens', () => {

    it('should set both Tokens', () => {
      defaultClientRestTTCookies.setTokens({},{},tokens)
      expect(mockcookie.str).toMatchSnapshot()
    })

  })

  describe('getAccessToken', () => {

    it('should get accessToken', () => {
      mockcookie.cookie = 'accessToken=' + accessToken;
      expect(defaultClientRestTTCookies.getAccessToken()).toBe(accessToken);
    })

    it('should return undefined if no accessToken', () => {
      expect(defaultClientRestTTCookies.getAccessToken()).toBe(undefined)
    })

  })

  describe('getRefreshToken', () => {

    it('should get refreshToken', () => {
      mockcookie.cookie = 'refreshToken=' + refreshToken;
      expect(defaultClientRestTTCookies.getRefreshToken()).toBe(refreshToken)
    })

    it('should return undefined if no refreshToken', () => {
      expect(defaultClientRestTTCookies.getRefreshToken()).toBe(undefined)
    })

  })

  describe('getTokens', () => {

    it('should get both Tokens', () => {
      document.cookie = 'accessToken=' + accessToken
      document.cookie = 'refreshToken=' + refreshToken
      expect(defaultClientRestTTCookies.getTokens()).toEqual(tokens)
    })

  })
  
})