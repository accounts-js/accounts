export enum AuthenticateWithServiceErrors {
  /**
   * Service is not registered on the server
   */
  ServiceNotFound = 'ServiceNotFound',
  /**
   * User is deactivated, so not allowed to login
   */
  UserDeactivated = 'UserDeactivated',
  /**
   * Service failed to authenticate the user
   */
  AuthenticationFailed = 'AuthenticationFailed',
}

export enum LoginWithServiceErrors {
  /**
   * Service is not registered on the server
   */
  ServiceNotFound = 'ServiceNotFound',
  /**
   * User is deactivated, so not allowed to login
   */
  UserDeactivated = 'UserDeactivated',
  /**
   * Service failed to authenticate the user
   */
  AuthenticationFailed = 'AuthenticationFailed',
}
