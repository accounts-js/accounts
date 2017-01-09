// @flow
/* eslint-disable max-len */
import type UserObjectType from '../common/UserObjectType';
// import AccountsServer from '../server/AccountsServer';
import { hashPassword, verifyPassword } from './encryption';

class DBDriver {
  hashPassword: (password: string) => Promise<string>
  verifyPassword: (password: string, hash: string) => Promise<boolean>
  findPasswordHash: (userId: string) => Promise<?string>
  createUser: (user: UserObjectType) => Promise<string>
  findUserByEmail: (email: string, onlyId: ?boolean) => Promise<UserObjectType | string | null>
  findUserByUsername: (username: string, onlyId: ?boolean) => Promise<UserObjectType | string | null>
  findUserById: (userId: string) => Promise<?UserObjectType>
  constructor() {
    this.hashPassword = hashPassword;
    this.verifyPassword = verifyPassword;
  }
}

export default DBDriver;
