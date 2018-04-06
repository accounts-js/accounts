import EmailNSMailgun from '../src';

jest.mock('mailgun-js', () => ({
  default: () => ({})
}))


const mailgunSendSpy = jest.fn(email => email)
const passwordEnrollSpy = jest.fn(()=>true)

const mailgun = {
  messages: ()=>({
    send: mailgunSendSpy
  })
}

const passwordPlugin = {
  name: 'password',
  enroll: passwordEnrollSpy
}


const config = {
  mailgun,
  plugins: [passwordPlugin]
}

const emailNSMailgun = new EmailNSMailgun(config)

describe('EmailNSMailgun', () => {

  describe('validateConfiguration', () => {
    
    it('should throw when no configuration object provided', () => {
      expect(()=> new EmailNSMailgun()).toThrowErrorMatchingSnapshot()
    })

    it('should throw when no valid mailgun config provided', () => {
      expect(()=> new EmailNSMailgun({ domain: true })).toThrowErrorMatchingSnapshot()
      expect(()=> new EmailNSMailgun({ apiKey: true })).toThrowErrorMatchingSnapshot()
    })

    it('should throw when no plugins provided', () => {
      expect(()=> new EmailNSMailgun({ domain: true, apiKey: true })).toThrowErrorMatchingSnapshot()
      expect(()=> new EmailNSMailgun({ mailgun: true })).toThrowErrorMatchingSnapshot()
    })

    it('should not throw when valid mailgun config provided', () => {
      expect(()=> new EmailNSMailgun({ domain: true, apiKey: true, plugins: [] })).not.toThrow()
      expect(()=> new EmailNSMailgun({ mailgun: true, plugins: [] })).not.toThrow()
    })

  })

  describe('constructor',() => {
    

    it('should provide a default from value', () => {
      expect(typeof emailNSMailgun.from).toBe('string')
    })

    it('should assign the from value of config', () => {
      expect(new EmailNSMailgun({ ...config, from: 'test' }).from).toBe('test')
    })

  })

  describe('send',() => {

    it('should throw if plugin not found', () => {
      emailNSMailgun.send('test')
      expect(mailgunSendSpy).toBeCalled()
    })
    
  })


  describe('notify',() => {
    

    it('should throw if plugin not found', () => {
      expect(()=>emailNSMailgun.notify('oauth')).toThrowErrorMatchingSnapshot()
    })

    it('should throw if action not found on plugin', () => {
      expect(()=>emailNSMailgun.notify('password', 'action')).toThrowErrorMatchingSnapshot()
    })

    it('should call the action if found on plugin', () => {
      emailNSMailgun.notify('password', 'enroll', { test: true })
      expect(passwordEnrollSpy).toBeCalled()
    })
    
  })

})
