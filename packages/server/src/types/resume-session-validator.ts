import { UserObjectType, SessionType } from '@accounts/common';

export type ResumeSessionValidator = (
  user: UserObjectType,
  session: SessionType
) => Promise<any>;