import ExpressTTHeaders from '../src';

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
  get: jest.fn(()=>true)
}

const res = {
  isResponse: true,
  set: jest.fn(()=>true)
}

const accessToken = 'accessTokenTest'
const refreshToken = 'refreshTokenTest'

const expressTTHeaders = new ExpressTTHeaders(config);
const denyExpressTTHeaders = new ExpressTTHeaders(denyConfig);
const defaultExpressTTHeaders = new ExpressTTHeaders();

beforeEach(jest.clearAllMocks)

describe('ExpressTTHeaders', () => {

  describe('default configuration', () => {
    
    it('should always allow to store accessToken', () => {
      expect(defaultExpressTTHeaders.accessConfig.canStore(req)).toBe(true);
    });

    it('should always allow to store refreshToken', () => {
      expect(defaultExpressTTHeaders.refreshConfig.canStore(req)).toBe(true);
    });
    
  });

  describe('constructor', () => {
    
    it('should provide a default accessConfig', () => {
      expect(defaultExpressTTHeaders.accessConfig).toBeDefined();
    });

    it('should provide a default refreshConfig', () => {
      expect(defaultExpressTTHeaders.refreshConfig).toBeDefined();
    });

    it('should merge the default accessConfig with the access property of the config', () => {
      expect(expressTTHeaders.accessConfig.name).toBe(config.access.name);
    });

    it('should merge the default refreshConfig with the refresh property of the config', () => {
      expect(expressTTHeaders.refreshConfig.name).toBe(config.refresh.name);
    });
    
  });

  describe('setAccessToken', () => {
    
    it('should call the canStore method on the accessConfig with the request object', () => {
      expressTTHeaders.setAccessToken(accessToken, { req, res })
      expect(config.access.canStore).toBeCalledWith(req)
    })

    it('should call the set method on the res object if canStore returns true', () => {
      expressTTHeaders.setAccessToken(accessToken, { req, res })
      expect(res.set).toBeCalledWith(config.access.name, accessToken)
    })

    it('should not call the set method on the res object if canStore returns false', () => {
      denyExpressTTHeaders.setAccessToken(accessToken, { req, res })
      expect(res.set).not.toBeCalled()
    })

  })

  describe('setRefreshToken', () => {
    
    it('should call the canStore method on the refreshConfig with the request object', () => {
      expressTTHeaders.setRefreshToken(refreshToken, { req, res })
      expect(config.refresh.canStore).toBeCalledWith(req)
    })

    it('should call the set method on the res object if canStore returns true', () => {
      expressTTHeaders.setRefreshToken(refreshToken, { req, res })
      expect(res.set).toBeCalledWith(config.refresh.name, refreshToken)
    })

    it('should not call the set method on the res object if canStore returns false', () => {
      denyExpressTTHeaders.setRefreshToken(refreshToken, { req, res })
      expect(res.set).not.toBeCalled()
    })

  })

  describe('setTokens', () => {
    
    it('should call the setAccessToken method', () => {
      expressTTHeaders.setTokens({ accessToken, refreshToken}, { req, res })
      expect(config.access.canStore).toBeCalledWith(req)
    })

    it('should call the setRefreshToken method', () => {
      expressTTHeaders.setTokens({ accessToken, refreshToken}, { req, res })
      expect(config.refresh.canStore).toBeCalledWith(req)
    })

  })

  describe('getAccessToken', () => {
    
    it('should call the get method on the request object with the accessToken name', () => {
      expressTTHeaders.getAccessToken(req)
      expect(req.get).toBeCalledWith(config.access.name)
    })

  })

  describe('getRefreshToken', () => {
    
    it('should call the get method on the request object with the refreshToken name', () => {
      expressTTHeaders.getRefreshToken(req)
      expect(req.get).toBeCalledWith(config.refresh.name)
    })

  })

  describe('getTokens', () => {
    
    it('should call the getAccessToken method', () => {
      expressTTHeaders.getTokens(req)
      expect(req.get).toBeCalledWith(config.access.name)
    })

    it('should call the getRefreshToken method', () => {
      expressTTHeaders.getTokens(req)
      expect(req.get).toBeCalledWith(config.access.name)
    })

  })


  describe('removeAccessToken', () => {
    
    it('should do nothing and return undefined', () => {
      expect(expressTTHeaders.removeAccessToken()).not.toBeDefined()
    })

  })

  describe('removeRefreshToken', () => {
    
    it('should do nothing and return undefined', () => {
      expect(expressTTHeaders.removeRefreshToken()).not.toBeDefined()
    })

  })

  describe('removeTokens', () => {
    
    it('should do nothing and return undefined', () => {
      expect(expressTTHeaders.removeTokens()).not.toBeDefined()
    })

  })
});
