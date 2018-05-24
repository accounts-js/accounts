export default class AccountsError extends Error {
  public packageName?: string;

  public functionName?: string;

  public reason?: string;

  constructor(packageName?: string, functionName?: string, reason?: string) {
    // Build Error message from parameters
    const message = reason
      ? `[ Accounts - ${packageName} ] ${functionName} : ${reason}`
      : packageName;

    // Build the underlying Error
    super(message);

    // Assign parameters for future use
    this.packageName = packageName;
    this.functionName = functionName;
    this.reason = reason;

    // Set the prototype to AccountsError so "instanceof AccountsError" returns true
    Object.setPrototypeOf(this, AccountsError.prototype);

    // Recapture the stack trace to avoid this function to be in it
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
