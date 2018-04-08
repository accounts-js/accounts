import { getCookie } from '../../src/utils/get-cookie';

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

document.__defineGetter__('cookie', ()=>mockcookie.cookie);
document.__defineSetter__('cookie', (s)=> {mockcookie.cookie = s});
document.reset = mockcookie.reset;

describe('utils > getCookie', () => {

  it('should get the cookie from document.cookie', () => {
    document.cookie = " test1=value;test2=else"
    expect(getCookie('test1')).toBe('value')
  })

  it('should return undefined if no cookie', () => {
    document.reset()
    expect(getCookie('test8')).toBe(undefined)
  })
})