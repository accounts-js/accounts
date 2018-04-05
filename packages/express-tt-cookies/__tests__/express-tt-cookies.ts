import ExpressTTCookies from '../src';

const accessToken = 'accessTokenTest'
const refreshToken = 'refreshTokenTest'

const config = {
  access: {
    name: 'accessName',
    canStore: jest.fn(()=>true)
  },
  refresh: {
    name: 'refreshName',
    canStore: jest.fn(()=>true)
  }
};

const denyConfig = {
  access: {
    name: 'accessName',
    canStore: jest.fn(()=>false)
  },
  refresh: {
    name: 'refreshName',
    canStore: jest.fn(()=>false)
  }
};

const req = {
  isRequest: true,
  cookies: {
    accessName: accessToken,
    refreshName: refreshToken
  }
}

const res = {
  isResponse: true,
  cookie: jest.fn(()=>true),
  clearCookie: jest.fn(()=>true),
}



const expressTTCookies = new ExpressTTCookies(config);
const denyExpressTTCookies = new ExpressTTCookies(denyConfig);
const defaultExpressTTCookies = new ExpressTTCookies();

const { name, canStore, ...defaultAccessCookieDirectives } = defaultExpressTTCookies.accessConfig;
const { name, canStore, ...defaultRefreshCookieDirectives } = defaultExpressTTCookies.refreshConfig;


beforeEach(jest.clearAllMocks)

describe('ExpressTTCookies', () => {

  describe('default configuration', () => {
    
    it('should always allow to store accessToken', () => {
      expect(defaultExpressTTCookies.accessConfig.canStore(req)).toBe(true);
    });

    it('should always allow to store refreshToken', () => {
      expect(defaultExpressTTCookies.refreshConfig.canStore(req)).toBe(true);
    });
    
  });

  describe('constructor', () => {
    
    it('should provide a default accessConfig', () => {
      expect(defaultExpressTTCookies.accessConfig).toBeDefined();
    });

    it('should provide a default refreshConfig', () => {
      expect(defaultExpressTTCookies.refreshConfig).toBeDefined();
    });

    it('should merge the default accessConfig with the access property of the config', () => {
      expect(expressTTCookies.accessConfig.name).toBe(config.access.name);
    });

    it('should merge the default refreshConfig with the refresh property of the config', () => {
      expect(expressTTCookies.refreshConfig.name).toBe(config.refresh.name);
    });
    
  });

  describe('setAccessToken', () => {
    
    it('should call the canStore method on the accessConfig with the request object', () => {
      expressTTCookies.setAccessToken(accessToken, { req, res })
      expect(config.access.canStore).toBeCalledWith(req)
    })

    it('should call the set method on the res object if canStore returns true', () => {
      expressTTCookies.setAccessToken(accessToken, { req, res })
      expect(res.cookie).toBeCalledWith(config.access.name, accessToken, defaultAccessCookieDirectives)
    })

    it('should not call the set method on the res object if canStore returns false', () => {
      denyExpressTTCookies.setAccessToken(accessToken, { req, res })
      expect(res.cookie).not.toBeCalled()
    })

  })

  describe('setRefreshToken', () => {
    
    it('should call the canStore method on the refreshConfig with the request object', () => {
      expressTTCookies.setRefreshToken(refreshToken, { req, res })
      expect(config.refresh.canStore).toBeCalledWith(req)
    })

    it('should call the set method on the res object if canStore returns true', () => {
      expressTTCookies.setRefreshToken(refreshToken, { req, res })
      expect(res.cookie).toBeCalledWith(config.refresh.name, refreshToken, defaultRefreshCookieDirectives)
    })

    it('should not call the set method on the res object if canStore returns false', () => {
      denyExpressTTCookies.setRefreshToken(refreshToken, { req, res })
      expect(res.cookie).not.toBeCalled()
    })

  })

  describe('setTokens', () => {
    
    it('should call the setAccessToken method', () => {
      expressTTCookies.setTokens({ accessToken, refreshToken}, { req, res })
      expect(config.access.canStore).toBeCalledWith(req)
    })

    it('should call the setRefreshToken method', () => {
      expressTTCookies.setTokens({ accessToken, refreshToken}, { req, res })
      expect(config.refresh.canStore).toBeCalledWith(req)
    })

  })

  describe('getAccessToken', () => {
    
    it('should access the [cookieName] propery on the request.cookies object', () => {
      expect(expressTTCookies.getAccessToken(req)).toBe(accessToken)
    })

  })

  describe('getRefreshToken', () => {
    
    it('should call the get method on the request object with the refreshToken name', () => {
      expressTTCookies.getRefreshToken(req)
      expect(expressTTCookies.getRefreshToken(req)).toBe(refreshToken)
    })

  })

  describe('getTokens', () => {
    
    it('should call the getAccessToken method and getRefreshToken method', () => {
      expect(expressTTCookies.getTokens(req)).toEqual({ accessToken, refreshToken })
    })
  })


  describe('removeAccessToken', () => {
    
    it('should call the clearCookie method on the response object', () => {
      expressTTCookies.removeAccessToken(res)
      expect(res.clearCookie).toBeCalledWith(config.access.name, defaultAccessCookieDirectives)
    })

  })

  describe('removeRefreshToken', () => {
    
    it('should call the clearCookie method on the response object', () => {
      expressTTCookies.removeRefreshToken(res)
      expect(res.clearCookie).toBeCalledWith(config.refresh.name, defaultRefreshCookieDirectives)
    })

  })

  describe('removeTokens', () => {
    
    it('should call the removeAccessToken method and the removeRefreshToken method', () => {
      expressTTCookies.removeTokens(res)
      expect(res.clearCookie).toBeCalledWith(config.access.name, defaultAccessCookieDirectives)
      expect(res.clearCookie).toBeCalledWith(config.refresh.name, defaultRefreshCookieDirectives)
    })

  })
});
