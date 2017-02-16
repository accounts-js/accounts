// @flow
/* eslint-disable max-len */
import type {
  UserObjectType,
  CreateUserType,
  SessionType,
} from '@accounts/common';

export interface DBInterface {
  findPasswordHash(userId: string) : Promise<?string>,
  createUser(user: CreateUserType) : Promise<string>,
  findUserByEmail(email: string) : Promise<?UserObjectType>,
  findUserByUsername(username: string) : Promise<?UserObjectType>,
  findUserById(userId: string) : Promise<?UserObjectType>,
  findUserByEmailVerificationToken(token: string) : Promise<?UserObjectType>,
  setUsername(userId: string, newUsername: string) : Promise<void>,
  addEmail(userId: string, newEmail: string, verified: boolean) : Promise<void>,
  removeEmail(userId: string, email: string) : Promise<void>,
  verifyEmail(userId: string, email: string) : Promise<void>,
  setPasssword(userId: string, newPassword: string) : Promise<void>,
  createSession(userId: string, ip: ?string, userAgent: ?string) : Promise<string>,
  updateSession(sessionId: string, ip: string, userAgent: string) : Promise<void>,
  invalidateSession(sessionId: string): Promise<void>,
  findSessionById(sessionId: string) : Promise<?SessionType>,
  setProfile(userId: string, profile: Object) : Promise<Object>
}
