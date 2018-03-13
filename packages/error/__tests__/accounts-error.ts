import AccountsError from '../src'

describe('AccountsError', () => {

  it('should return an Error', () => {
    expect(new AccountsError() instanceof Error).toBe(true);
  });

  it('should be an instance of AccountsError', () => {
    expect(new AccountsError() instanceof AccountsError).toBe(true);
  });

  it('should take 1 parameter and make it it\'s message', () => {
    expect(new AccountsError('message').message).toBe('message');
  });

  it('should take 3 parameter and make a formatted Message', () => {
    expect(new AccountsError('Package', 'method', 'reason').message).toBe('[ Accounts - Package ] method : reason');
  });

  it('should have a public property packageName', () => {
    expect(new AccountsError('Package', 'method', 'reason').packageName).toBe('Package');
  });

  it('should have a public property functionName', () => {
    expect(new AccountsError('Package', 'method', 'reason').functionName).toBe('method');
  });

  it('should have a public property reason', () => {
    expect(new AccountsError('Package', 'method', 'reason').reason).toBe('reason');
  });

  it('should capture the stackTrace', () => {
    Error.captureStackTrace = jest.fn(()=>null);
    new AccountsError()
    expect(Error.captureStackTrace).toHaveBeenCalled();
  });

  Error.captureStackTrace = null;

  it('should capture a stackTrace even if Error.captureStackTrace is not available', () => {
    expect(new AccountsError().stack).not.toBe(undefined);
  });

  /* it('should call super', ()=>{
    const trigger = jest.fn(()=>null);
    const eee = Error
    Error.call = function(error, message){
      trigger(message)
      return eee(error, message)
    }
    const a = new AccountsError('test')
    
    expect(trigger).toHaveBeenCalledWith('test')
  }) */

});
