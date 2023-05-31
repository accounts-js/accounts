export * from './AccountsTypeORMConfig.symbol';
export * from './User.symbol';
export * from './UserEmail.symbol';
export * from './UserService.symbol';
export * from './UserSession.symbol';

export interface AccountsTypeormOptions {
  cache?: undefined | number;
  // connection?: Connection;
  connectionName?: string;
}
