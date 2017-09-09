import { UserObjectType, CreateUserType, SessionType } from '@accounts/common';

export interface DBInterface {
  // Find user by identity fields
  findUserByEmail(email: string): Promise<UserObjectType>;
  findUserByUsername(username: string): Promise<UserObjectType>;
  findUserById(userId: string): Promise<UserObjectType>;

  // Create and update users
  createUser(user: CreateUserType): Promise<string>;
  setUsername(userId: string, newUsername: string): Promise<void>;
  setProfile(userId: string, profile: object): Promise<object>;

  // Auth services related operations
  findByService(serviceName: string, pickBy: object): Promise<UserObjectType>;
  setServiceData(serviceName: string, data: object): Promise<void>;

  // // Password related operation
  // findPasswordHash(userId: string): Promise<string>;
  // findUserByResetPasswordToken(token: string): Promise<UserObjectType>;
  // setPasssword(userId: string, newPassword: string): Promise<void>;
  // addResetPasswordToken(
  //   userId: string,
  //   email: string,
  //   token: string,
  //   reason?: string
  // ): Promise<void>;
  // setResetPasssword(
  //   userId: string,
  //   email: string,
  //   newPassword: string,
  //   token: string
  // ): Promise<void>;

  // Email related operations
  findUserByEmailVerificationToken(token: string): Promise<UserObjectType>;
  addEmail(userId: string, newEmail: string, verified: boolean): Promise<void>;
  removeEmail(userId: string, email: string): Promise<void>;
  verifyEmail(userId: string, email: string): Promise<void>;
  addEmailVerificationToken(
    userId: string,
    email: string,
    token: string
  ): Promise<void>;

  // Session related operations
  findSessionById(sessionId: string): Promise<SessionType>;
  createSession(
    userId: string,
    ip?: string,
    userAgent?: string,
    extraData?: object
  ): Promise<string>;
  updateSession(
    sessionId: string,
    ip?: string,
    userAgent?: string
  ): Promise<void>;
  invalidateSession(sessionId: string): Promise<void>;
  invalidateAllSessions(userId: string): Promise<void>;
}
