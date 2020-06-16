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
   * The authenticators collection name, default 'authenticators'.
   */
  authenticatorCollectionName?: string;
  /**
   * The mfa challenges collection name, default 'mfaChallenges'.
   */
  mfaChallengeCollectionName?: string;
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
   * Should the authenticator collection use _id as string or ObjectId.
   * Default 'true'.
   */
  convertAuthenticatorIdToMongoObjectId?: boolean;
  /**
   * Should the mfa challenge collection use _id as string or ObjectId.
   * Default 'true'.
   */
  convertMfaChallengeIdToMongoObjectId?: boolean;
  /**
   * Perform case insensitive query for user name.
   * Default 'true'.
   */
  caseSensitiveUserName?: boolean;
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

export interface MongoUser {
  _id?: string | object;
  username?: string;
  services: {
    password?: {
      bcrypt: string;
    };
  };
  emails?: [
    {
      address: string;
      verified: boolean;
    }
  ];
  [key: string]: any;
}

export interface MongoAuthenticator {
  _id?: string | object;
  type?: string;
  userId?: string;
  [key: string]: any;
}

export interface MongoMfaChallenge {
  _id?: string | object;
  userId?: string;
  authenticatorId?: string;
  token: string;
}
