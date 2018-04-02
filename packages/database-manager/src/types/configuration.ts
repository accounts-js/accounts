import { DatabaseInterface } from '@accounts/types';

export interface Configuration {

  userStorage: DatabaseInterface;

  sessionStorage: DatabaseInterface;
  
}
