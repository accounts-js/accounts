import { DBInterface as DatabaseInterface } from '@accounts/server';

export interface Configuration {

  userStorage: DatabaseInterface;

  sessionStorage: DatabaseInterface;
  
}
