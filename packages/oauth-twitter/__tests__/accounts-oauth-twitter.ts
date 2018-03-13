import * as oauth from 'oauth';

import AccountsOAuthTwitter from '../src';



jest.mock('oauth',() =>({
  OAuth: jest.fn(()=>({
    get: jest.fn((a, b, c, callback)=>callback(b,JSON.stringify({
      id_str:'',
      screen_name:'',
      profile_image_url_https:'',
      email:'',
      access_token:'',
      access_token_secret:'',
    })))
  }))
}))

describe('AccountsOAuthTwitter', () => {
  const twitterProvider = new AccountsOAuthTwitter({ key: '', secret: '' })
  describe('constructor', () => {

    it('should have called the oauth.OAuth function', () => {
      expect(oauth.OAuth).toHaveBeenCalled()
    })

  })



  describe('authenticate', () => {

    it('should return a promise', () => {
      expect(twitterProvider.authenticate() instanceof Promise).toBe(true)
    })

    it('should reject on oauth error', async () => {
      const catcher = jest.fn()
      await twitterProvider.authenticate({access_token: true}).catch(catcher)
      expect(catcher).toHaveBeenCalled()
    })

    it('should resolve with user data', async () => {
      const resolver = jest.fn()
      await twitterProvider.authenticate({}).then(resolver)
      expect(resolver).toHaveBeenCalled()
    })

  })

})
