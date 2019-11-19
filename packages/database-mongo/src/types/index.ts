export interface AccountsMongoOptions {
  /**
   * The users collection name, default 'users'.
   */
  collectionName?: string;
  /**
   * The sessions collection name, default 'sessions'.
   */
  sessionCollectionName?: string;
  /**
   * The authenticators collection name, default 'authenticators'.
   */
  authenticatorCollectionName?: string;
  /**
   * The mfa challenges collection name, default 'mfaChallenges'.
   */
  mfaChallengeCollection?: string;
  /**
   * The timestamps for the users and sessions collection, default 'createdAt' and 'updatedAt'.
   */
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  /**
   * Should the user collection use _id as string or ObjectId, default 'true'.
   */
  convertUserIdToMongoObjectId?: boolean;
  /**
   * Should the session collection use _id as string or ObjectId, default 'true'.
   */
  convertSessionIdToMongoObjectId?: boolean;
  /**
   * Should the authenticator collection use _id as string or ObjectId, default 'true'.
   */
  convertAuthenticatorIdToMongoObjectId: boolean;
  /**
   * Perform case intensitive query for user name, default 'true'.
   */
  caseSensitiveUserName?: boolean;
  /**
   * Function that generate the id for new objects.
   */
  idProvider?: () => string | object;
  /**
   * Function that generate the date for the timestamps.
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
