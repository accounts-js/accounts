import { IDatabase } from 'pg-promise';

export interface AccountsPostgresOptions {
  /**
   * The users table name, default 'users'.
   */
  userTableName?: string;
  /**
   * The sessions table name, default 'sessions'.
   */
  sessiontableName?: string;

  emailTable?: string;
  /**
   * The timestamps for the users and sessions table, default 'createdAt' and 'updatedAt'.
   */
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  /**
   * Perform case intensitive query for user name, default 'true'.
   */
  caseSensitiveUserName?: boolean;
  /**
   * Function that generate the id for new objects.
   */
  idProvider?: () => string;
  /**
   * Function that generate the date for the timestamps.
   */
  dateProvider?: (date?: Date) => any;

  /**
   * Optional pg client
   */
  db?: any;

  uri: string;
}

export interface PostgresUser {
  id?: string;
  username?: string;
  profile?: string;
}

export interface PostgresServices {
  [key: string]: {
    bcrypt?: string;
  };
}

export interface PostgresEmail {
  address: string;
  verified: boolean;
}
