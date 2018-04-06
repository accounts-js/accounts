import EmailPluginPassword from '../src';

const emailData = {
  user: undefined,
  token: 'tokenTest',
  email: 'emailAddress'
}

const emailPluginPassword = new EmailPluginPassword()

describe('EmailPluginPassword', () => {

  describe('constructor',() => {
    it('should execute fine without config', ()=>{
      expect(() => new EmailPluginPassword()).not.toThrow()
    })
    it('should assign from property of config to itself', ()=>{
      const EPPwithFrom = new EmailPluginPassword({ from: 'fromTest'})
      expect(EPPwithFrom.from).toBe('fromTest')
    })
  })

  describe('enroll',() => {
    it('should call the first parameter', ()=>{
      const send = jest.fn(()=>true)
      emailPluginPassword.enroll(send, emailData)
      expect(send).toBeCalled()
    })
  })

  describe('resetPassword',() => {
    it('should call the first parameter', ()=>{
      const send = jest.fn(()=>true)
      emailPluginPassword.resetPassword(send, emailData)
      expect(send).toBeCalled()
    })
  })

  describe('verifyEmail',() => {
    it('should call the first parameter', ()=>{
      const send = jest.fn(()=>true)
      emailPluginPassword.verifyEmail(send, emailData)
      expect(send).toBeCalled()
    })
  })

})
