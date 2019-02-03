import { User } from '../entity/User';
import { UserEmail } from '../entity/UserEmail';
import { UserService } from '../entity/UserService';
import { UserSession } from '../entity/UserSession';
import { Connection } from 'typeorm';

export interface AccountsTypeormOptions {
  cache?: undefined | number;
  connection?: Connection;
  connectionName?: string;
  userEntity?: typeof User;
  userServiceEntity?: typeof UserService;
  userEmailEntity?: typeof UserEmail;
  userSessionEntity?: typeof UserSession;
}
