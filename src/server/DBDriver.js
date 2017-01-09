// @flow
/* eslint-disable max-len */
import type UserObjectType from '../common/UserObjectType';

class DBDriver {
  findPasswordHash: (userId: string) => Promise<?string>
  createUser: (user: UserObjectType) => Promise<string>
  findUserByEmail: (email: string, onlyId: ?boolean) => Promise<UserObjectType | string | null>
  findUserByUsername: (username: string, onlyId: ?boolean) => Promise<UserObjectType | string | null>
  findUserById: (userId: string) => Promise<?UserObjectType>
  setUsername: (userId: string, newUsername: string) => Promise<void>
  addEmail: (userId: string, newEmail: string, verified: boolean) => Promise<void>
  removeEmail: (userId: string, email: string) => Promise<void>
  verifyEmail: (userId: string, email: string) => Promise<void>
  setPasssword: (userId: string, newPassword: string) => Promise<void>
}

export default DBDriver;
