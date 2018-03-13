import { UserObjectType } from '@accounts/common';

export interface EmailTemplateType {
  from?: string;
  subject: (user?: UserObjectType) => string;
  text: (user: UserObjectType, url: string) => string;
}
