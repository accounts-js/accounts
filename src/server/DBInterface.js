// @flow
/* eslint-disable max-len */
import type {
  UserObjectType,
  CreateUserType,
  SessionType,
} from '../common/types';

export interface DBInterface {
  findPasswordHash(userId: string) : Promise<?string>,
  createUser(user: CreateUserType) : Promise<string>,
  findUserByEmail(email: string) : Promise<?UserObjectType>,
  findUserByUsername(username: string) : Promise<?UserObjectType>,
  findUserById(userId: string) : Promise<?UserObjectType>,
  setUsername(userId: string, newUsername: string) : Promise<void>,
  addEmail(userId: string, newEmail: string, verified: boolean) : Promise<void>,
  removeEmail(userId: string, email: string) : Promise<void>,
  verifyEmail(userId: string, email: string) : Promise<void>,
  setPasssword(userId: string, newPassword: string) : Promise<void>,
  createSession(userId: string, userAgent: ?string) : Promise<string>,
  findSessionById(sessionId: string) : Promise<SessionType>,
  updateSession(sessionId: string) : Promise<void>,
  invalidateSession(sessionId: string): Promise<void>
}
