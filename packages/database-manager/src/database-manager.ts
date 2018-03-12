import { DBInterface as DatabaseInterface } from '@accounts/server';

import { Configuration } from './types/configuration';

export default class DatabaseManager implements DatabaseInterface {

  private userStorage: DatabaseInterface;

  private sessionStorage: DatabaseInterface;

  constructor(configuration: Configuration) {
    this.validateConfiguration(configuration);
    this.userStorage = configuration.userStorage;
    this.sessionStorage = configuration.sessionStorage;
  }

  private validateConfiguration(configuration: Configuration): void {
    if (!configuration){
      throw new Error('[ Accounts - DatabaseManager ] configuration : A configuration object is required on DatabaseManager');
    }
    if (!configuration.userStorage){
      throw new Error('[ Accounts - DatabaseManager ] configuration : A userStorage DatabaseInterface is required');
    }
    if (!configuration.sessionStorage){
      throw new Error('[ Accounts - DatabaseManager ] configuration : A sessionStorage DatabaseInterface is required');
    }
  }

  public get createUser(): DatabaseInterface['createUser'] {
    return this.userStorage.createUser.bind(this.userStorage);
  }

  public get findUserById(): DatabaseInterface['findUserById'] {
    return this.userStorage.findUserById.bind(this.userStorage);
  }

  public get findUserByEmail(): DatabaseInterface['findUserByEmail'] {
    return this.userStorage.findUserByEmail.bind(this.userStorage);
  }

  public get findUserByUsername(): DatabaseInterface['findUserByUsername'] {
    return this.userStorage.findUserByUsername.bind(this.userStorage);
  }

  public get findPasswordHash(): DatabaseInterface['findPasswordHash'] {
    return this.userStorage.findPasswordHash.bind(this.userStorage);
  }

  public get findUserByEmailVerificationToken(): DatabaseInterface['findUserByEmailVerificationToken'] {
    return this.userStorage.findUserByEmailVerificationToken.bind(this.userStorage);
  }

  public get findUserByResetPasswordToken(): DatabaseInterface['findUserByResetPasswordToken'] {
    return this.userStorage.findUserByResetPasswordToken.bind(this.userStorage);
  }

  public get findUserByServiceId(): DatabaseInterface['findUserByServiceId'] {
    return this.userStorage.findUserByServiceId.bind(this.userStorage);
  }

  public get addEmail(): DatabaseInterface['addEmail'] {
    return this.userStorage.addEmail.bind(this.userStorage);
  }

  public get removeEmail(): DatabaseInterface['removeEmail'] {
    return this.userStorage.removeEmail.bind(this.userStorage);
  }

  public get verifyEmail(): DatabaseInterface['verifyEmail'] {
    return this.userStorage.verifyEmail.bind(this.userStorage);
  }

  public get setUsername(): DatabaseInterface['setUsername'] {
    return this.userStorage.setUsername.bind(this.userStorage);
  }

  public get setPassword(): DatabaseInterface['setPassword'] {
    return this.userStorage.setPassword.bind(this.userStorage);
  }

  public get setProfile(): DatabaseInterface['setProfile'] {
    return this.userStorage.setProfile.bind(this.userStorage);
  }

  public get setService(): DatabaseInterface['setService'] {
    return this.userStorage.setService.bind(this.userStorage);
  }

  public get createSession(): DatabaseInterface['createSession'] {
    return this.sessionStorage.createSession.bind(this.sessionStorage);
  }

  public get updateSession(): DatabaseInterface['updateSession'] {
    return this.sessionStorage.updateSession.bind(this.sessionStorage);
  }

  public get invalidateSession(): DatabaseInterface['invalidateSession'] {
    return this.sessionStorage.invalidateSession.bind(this.sessionStorage);
  }

  public get invalidateAllSessions(): DatabaseInterface['invalidateAllSessions'] {
    return this.sessionStorage.invalidateAllSessions.bind(this.sessionStorage);
  }

  public get findSessionByToken(): DatabaseInterface['findSessionByToken'] {
    return this.sessionStorage.findSessionByToken.bind(this.sessionStorage);
  }

  public get findSessionById(): DatabaseInterface['findSessionById'] {
    return this.sessionStorage.findSessionById.bind(this.sessionStorage);
  }

  public get addEmailVerificationToken(): DatabaseInterface['addEmailVerificationToken'] {
    return this.userStorage.addEmailVerificationToken.bind(this.userStorage);
  }

  public get addResetPasswordToken(): DatabaseInterface['addResetPasswordToken'] {
    return this.userStorage.addResetPasswordToken.bind(this.userStorage);
  }

  public get setResetPassword(): DatabaseInterface['setResetPassword'] {
    return this.userStorage.setResetPassword.bind(this.userStorage);
  }
}
