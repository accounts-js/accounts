import * as bcrypt from 'bcryptjs';
export interface AccountsPostgresOptions {
  /**
   * The users collection name, default 'users'.
   */
  collectionName?: string;
  /**
   * The sessions collection name, default 'sessions'.
   */
  sessionCollectionName?: string;
  /**
   * The timestamps for the users and sessions collection, default 'createdAt' and 'updatedAt'.
   */
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  /**
   * Function that generate the id for new objects.
   */
  idProvider?: () => string | object;
  /**
   * Function that generate the date for the timestamps.
   */
  dateProvider?: (date?: Date) => any;
}

export interface PostgresUser {
  id?: string;
  username?: string;
  profile?: string;
}

export interface PostgresSession {
  [key: string]: any;
}

export interface PostgressSessionPassword extends PostgresSession {
  bcrypt?: string;
}
