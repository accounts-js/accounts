import EmailNSDebug from '../src';

const passwordEnrollSpy = jest.fn(()=>true)

const passwordPlugin = {
  name: 'password',
  enroll: passwordEnrollSpy
}

const config = {
  plugins: [passwordPlugin]
}

const emailNSDebug = new EmailNSDebug(config)

describe('EmailNSMailgun', () => {


  describe('send',() => {

    it('should print the email in console', () => {
      const temp = console.dir;
      console.dir = jest.fn(()=>true);
      emailNSDebug.send('test');
      expect(console.dir).toBeCalled();
      console.dir = temp;
    })
    
  })


  describe('notify',() => {
    

    it('should throw if plugin not found', () => {
      expect(()=>emailNSDebug.notify('oauth')).toThrowErrorMatchingSnapshot()
    })

    it('should throw if action not found on plugin', () => {
      expect(()=>emailNSDebug.notify('password', 'action')).toThrowErrorMatchingSnapshot()
    })

    it('should call the action if found on plugin', () => {
      emailNSDebug.notify('password', 'enroll', { test: true })
      expect(passwordEnrollSpy).toBeCalled()
    })
    
  })

})
