// @flow
/* eslint-disable max-len */
import type UserObjectType from '../common/UserObjectType';
// import AccountsServer from '../server/AccountsServer';

class DBDriver {
  findPasswordHash: (userId: string) => Promise<?string>
  createUser: (user: UserObjectType) => Promise<string>
  findUserByEmail: (email: string, onlyId: ?boolean) => Promise<UserObjectType | string | null>
  findUserByUsername: (username: string, onlyId: ?boolean) => Promise<UserObjectType | string | null>
  findUserById: (userId: string) => Promise<?UserObjectType>
}

export default DBDriver;
