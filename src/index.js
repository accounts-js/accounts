/* eslint-disable import/no-named-as-default */
import AccountsClient from './client/AccountsClient';
import AccountsServer from './server/AccountsServer';
import * as PasswordSignupFields from './common/passwordSignupFields';
import * as encryption from './server/encryption';
import * as validators from './common/validators';
import { AccountsError } from './common/errors';
import type { DBInterface } from './server/DBInterface';
import type { TransportInterface } from './client/TransportInterface';

import type {
  UserObjectType,
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
  SessionType,
} from './common/types';

export {
  AccountsClient,
  AccountsServer,
  PasswordSignupFields,
  encryption,
  validators,
  AccountsError,
};

export type {
  DBInterface,
  TransportInterface,
};

export type {
  UserObjectType,
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
  SessionType,
};
