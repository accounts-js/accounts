// @flow
import type UserObjectType from '../common/UserObjectType';
// import AccountsServer from '../server/AccountsServer';
import { hashPassword, verifyPassword } from './encryption';

class DBDriver {
  hashPassword: (password: string) => Promise<string>
  verifyPassword: (password: string, hash: string) => Promise<boolean>
  createUser: (user: UserObjectType) => Promise<string>
  findUserByEmail: (email: string, onlyId: ?boolean) => Promise<?UserObjectType>
  findUserByUsername: (username: string, onlyId: ?boolean) => Promise<?UserObjectType>
  findUserById: (userId: string) => Promise<?UserObjectType>
  loginWithPassword: (user: string) => Promise<boolean>
  constructor() {
    this.hashPassword = hashPassword;
    this.verifyPassword = verifyPassword;
  }
}

export default DBDriver;
