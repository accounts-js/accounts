import { UserObjectType, SessionType, CreateUserType } from '@accounts/common';
import { ConnectionInformationsType } from './connection-informations-type';

export interface DBInterface {
  // Find user by identity fields
  findUserByEmail(email: string): Promise<UserObjectType | null>;
  findUserByUsername(username: string): Promise<UserObjectType | null>;
  findUserById(userId: string): Promise<UserObjectType | null>;

  // Create and update users
  createUser(user: CreateUserType): Promise<string>;
  setUsername(userId: string, newUsername: string): Promise<void>;
  setProfile(userId: string, profile: object): Promise<object>;

  // Auth services related operations
  findUserByServiceId(serviceName: string, serviceId: string): Promise<UserObjectType | null>;
  setService(userId: string, serviceName: string, data: object): Promise<void>;
  unsetService(userId: string, serviceName: string): Promise<void>;

  // Password related operation
  findPasswordHash(userId: string): Promise<string | null>;
  findUserByResetPasswordToken(token: string): Promise<UserObjectType | null>;
  setPassword(userId: string, newPassword: string): Promise<void>;
  addResetPasswordToken(
    userId: string,
    email: string,
    token: string,
    reason?: string
  ): Promise<void>;
  setResetPassword(
    userId: string,
    email: string,
    newPassword: string,
    token: string
  ): Promise<void>;

  // Email related operations
  findUserByEmailVerificationToken(token: string): Promise<UserObjectType | null>;
  addEmail(userId: string, newEmail: string, verified: boolean): Promise<void>;
  removeEmail(userId: string, email: string): Promise<void>;
  verifyEmail(userId: string, email: string): Promise<void>;
  addEmailVerificationToken(userId: string, email: string, token: string): Promise<void>;

  // Session related operations
  findSessionById(sessionId: string): Promise<SessionType | null>;
  findSessionByToken(token: string): Promise<SessionType | null>;
  createSession(
    userId: string,
    token: string,
    connection: ConnectionInformationsType,
    extraData?: object
  ): Promise<string>;
  updateSession(sessionId: string, connection: ConnectionInformationsType): Promise<void>;
  invalidateSession(sessionId: string): Promise<void>;
  invalidateAllSessions(userId: string): Promise<void>;
}
