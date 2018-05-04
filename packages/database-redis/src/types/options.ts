export interface AccountsRedisOptions {
  /**
   * The users collection name, default 'users'.
   */
  userCollectionName?: string;
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
   * Default to shortid npm package `shortid.generate()`
   */
  idProvider?: () => string | object;
  /**
   * Function that generate the date for the timestamps.
   */
  dateProvider?: (date?: Date) => any;
}
