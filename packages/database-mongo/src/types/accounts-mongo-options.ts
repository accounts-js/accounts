export interface AccountsMongoOptions {
  /**
   * The users collection name.
   * Default 'users'.
   */
  collectionName?: string;
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
   * Should the user collection use _id as string or ObjectId.
   * Default 'true'.
   */
  convertUserIdToMongoObjectId?: boolean;
  /**
   * Should the session collection use _id as string or ObjectId.
   * Default 'true'.
   */
  convertSessionIdToMongoObjectId?: boolean;
  /**
   * Perform case intensitive query for user name.
   * Default 'true'.
   */
  caseSensitiveUserName?: boolean;
  /**
   * Function that generates the _id for new Session objects.
   * If 'undefined' then 'convertSessionIdToMongoObjectId' must be 'true'.
   * Default 'undefined'
   */
  idSessionProvider?: () => string | object;
  /**
   * Function that generate the id for new objects.
   */
  idProvider?: () => string | object;
  /**
   * Function that generate the date for the timestamps.
   * Default to `(date?: Date) => (date ? date.getTime() : Date.now())`.
   */
  dateProvider?: (date?: Date) => any;
}
