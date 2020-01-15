import {
  DatabaseInterface,
  DatabaseInterfaceSessions,
  DatabaseInterfaceServicePassword,
} from '@accounts/types';

import { Configuration } from './types/configuration';

export class DatabaseManager implements DatabaseInterface {
  private userStorage: DatabaseInterface;
  public sessions: DatabaseInterfaceSessions;
  public password: DatabaseInterfaceServicePassword;

  constructor(configuration: Configuration) {
    this.validateConfiguration(configuration);
    this.userStorage = configuration.userStorage;
    this.sessions = configuration.sessionStorage || configuration.userStorage.sessions;
    this.password = configuration.servicePassword || configuration.userStorage.password;
  }

  private validateConfiguration(configuration: Configuration): void {
    if (!configuration) {
      throw new Error(
        '[ Accounts - DatabaseManager ] configuration : A configuration object is required on DatabaseManager'
      );
    }
    if (!configuration.userStorage) {
      throw new Error(
        '[ Accounts - DatabaseManager ] configuration : A userStorage DatabaseInterface is required'
      );
    }
  }

  // Return the createUser function from the userStorage
  public get createUser(): DatabaseInterface['createUser'] {
    return this.userStorage.createUser.bind(this.userStorage);
  }

  // Return the findUserById function from the userStorage
  public get findUserById(): DatabaseInterface['findUserById'] {
    return this.userStorage.findUserById.bind(this.userStorage);
  }

  // Return the findUserByEmail function from the userStorage
  public get findUserByEmail(): DatabaseInterface['findUserByEmail'] {
    return this.userStorage.findUserByEmail.bind(this.userStorage);
  }

  // Return the findUserByUsername function from the userStorage
  public get findUserByUsername(): DatabaseInterface['findUserByUsername'] {
    return this.userStorage.findUserByUsername.bind(this.userStorage);
  }

  // Return the findUserByServiceId function from the userStorage
  public get findUserByServiceId(): DatabaseInterface['findUserByServiceId'] {
    return this.userStorage.findUserByServiceId.bind(this.userStorage);
  }

  // Return the setUsername function from the userStorage
  public get setUsername(): DatabaseInterface['setUsername'] {
    return this.userStorage.setUsername.bind(this.userStorage);
  }

  // Return the setService function from the userStorage
  public get setService(): DatabaseInterface['setService'] {
    return this.userStorage.setService.bind(this.userStorage);
  }

  // Return the unsetService function from the userStorage
  public get unsetService(): DatabaseInterface['unsetService'] {
    return this.userStorage.unsetService.bind(this.userStorage);
  }

  // Return the setResetPassword function from the userStorage
  public get setUserDeactivated(): DatabaseInterface['setUserDeactivated'] {
    return this.userStorage.setUserDeactivated.bind(this.userStorage);
  }
}
