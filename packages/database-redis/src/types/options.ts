export interface AccountsRedisOptions {
  /**
   * The users collection name.
   * Default 'users'.
   */
  userCollectionName?: string;
  /**
   * The sessions collection name.
   * Default 'sessions'.
   */
  sessionCollectionName?: string;
  /**
   * The timestamps for the users and sessions collection.
   * Default 'createdAt' and 'updatedAt'.
   */
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  /**
   * Function that generate the id for new objects.
   * Default to shortid npm package `shortid.generate()`
   */
  idProvider?: () => string;
  /**
   * Function that generate the date for the timestamps.
   * Default to `(date?: Date) => (date ? date.getTime() : Date.now())`.
   */
  dateProvider?: (date?: Date) => any;
}
