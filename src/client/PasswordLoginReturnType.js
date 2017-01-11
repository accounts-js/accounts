// @flow
import type UserObjectType from '../common/UserObjectType';
import type SessionType from '../common/SessionType';

export type PasswordLoginReturnType = {
  user: UserObjectType,
  session: SessionType
};
