import { setCookie } from '../../src/utils/set-cookie';

const getCookieSpy = jest.fn(()=>null);
const setCookieSpy = jest.fn(()=>null);

document.__defineGetter__('cookie', getCookieSpy);
document.__defineSetter__('cookie', setCookieSpy);

describe('utils > setCookie', () => {

  it('should set the cookie from document.cookie', () => {
    setCookie('test1', 'correctValue', 10)
    expect(setCookieSpy).toHaveBeenCalled()
  })

})