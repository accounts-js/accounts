import ExpressTTBody from '../src';

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
  get: jest.fn(()=>true),
  body: {
    accessName: accessToken,
    refreshName: refreshToken
  }
}

const res = {
  isResponse: true,
  set: jest.fn(()=>true)
}


const expressTTBody = new ExpressTTBody(config);
const denyExpressTTBody = new ExpressTTBody(denyConfig);
const defaultExpressTTBody = new ExpressTTBody();

beforeEach(() => {
  jest.clearAllMocks();
  res.toSend = undefined;
})

describe('ExpressTTBody', () => {

  describe('default configuration', () => {
    
    it('should always allow to store accessToken', () => {
      expect(defaultExpressTTBody.accessConfig.canStore(req)).toBe(true);
    });

    it('should always allow to store refreshToken', () => {
      expect(defaultExpressTTBody.refreshConfig.canStore(req)).toBe(true);
    });
    
  });

  describe('constructor', () => {
    
    it('should provide a default accessConfig', () => {
      expect(defaultExpressTTBody.accessConfig).toBeDefined();
    });

    it('should provide a default refreshConfig', () => {
      expect(defaultExpressTTBody.refreshConfig).toBeDefined();
    });

    it('should merge the default accessConfig with the access property of the config', () => {
      expect(expressTTBody.accessConfig.name).toBe(config.access.name);
    });

    it('should merge the default refreshConfig with the refresh property of the config', () => {
      expect(expressTTBody.refreshConfig.name).toBe(config.refresh.name);
    });
    
  });

  describe('setAccessToken', () => {
    
    it('should call the canStore method on the accessConfig with the request object', () => {
      expressTTBody.setAccessToken(accessToken, { req, res })
      expect(config.access.canStore).toBeCalledWith(req)
    })

    it('should not remove the content of res.toSend', () => {
      res.toSend = { content: true };
      expressTTBody.setAccessToken(accessToken, { req, res })
      expect(res.toSend).toEqual({ [config.access.name]: accessToken, content: true })
    })

    it('should add the accessToken in a toSend object in the response if canStore is true', () => {
      expressTTBody.setAccessToken(accessToken, { req, res })
      expect(res.toSend).toEqual({ [config.access.name]: accessToken })
    })

    it('should not add the accessToken if canStore is false', () => {
      denyExpressTTBody.setAccessToken(accessToken, { req, res })
      expect(res.toSend).not.toBeDefined()
    })

  })

  describe('setRefreshToken', () => {
    
    it('should call the canStore method on the refreshConfig with the request object', () => {
      expressTTBody.setRefreshToken(refreshToken, { req, res })
      expect(config.refresh.canStore).toBeCalledWith(req)
    })

    it('should not remove the content of res.toSend', () => {
      res.toSend = { content: true };
      expressTTBody.setRefreshToken(refreshToken, { req, res })
      expect(res.toSend).toEqual({ [config.refresh.name]: refreshToken, content: true })
    })
    
    it('should add the token in a toSend object in the response if canStore is true', () => {
      expressTTBody.setRefreshToken(refreshToken, { req, res })
      expect(res.toSend).toEqual({ [config.refresh.name]: refreshToken })
    })

    it('should not add the token if canStore is false', () => {
      denyExpressTTBody.setRefreshToken(refreshToken, { req, res })
      expect(res.toSend).not.toBeDefined()
    })

  })

  describe('setTokens', () => {
    
    it('should call the setAccessToken method', () => {
      expressTTBody.setTokens({ accessToken, refreshToken}, { req, res })
      expect(config.access.canStore).toBeCalledWith(req)
    })

    it('should call the setRefreshToken method', () => {
      expressTTBody.setTokens({ accessToken, refreshToken}, { req, res })
      expect(config.refresh.canStore).toBeCalledWith(req)
    })

  })

  describe('getAccessToken', () => {
    
    it('should access the [accessTokenName] property on the body of the request', () => {
      expect(expressTTBody.getAccessToken(req)).toBe(accessToken)
    })

  })

  describe('getRefreshToken', () => {
    
    it('should access the [refreshTokenName] property on the body of the request', () => {
      expect(expressTTBody.getRefreshToken(req)).toBe(refreshToken)
    })

  })

  describe('getTokens', () => {
    
    it('should call the getAccessToken method and the getRefreshToken method', () => {
      expect(expressTTBody.getTokens(req)).toEqual({ accessToken, refreshToken })
    })

  })


  describe('removeAccessToken', () => {
    
    it('should do nothing and return undefined', () => {
      expect(expressTTBody.removeAccessToken()).not.toBeDefined()
    })

  })

  describe('removeRefreshToken', () => {
    
    it('should do nothing and return undefined', () => {
      expect(expressTTBody.removeRefreshToken()).not.toBeDefined()
    })

  })

  describe('removeTokens', () => {
    
    it('should do nothing and return undefined', () => {
      expect(expressTTBody.removeTokens()).not.toBeDefined()
    })

  })
});
