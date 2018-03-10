import { UserObjectType } from '@accounts/common';
import { EmailTemplateType } from './EmailTemplateType';

export type PrepareMailFunction = (
  to: string,
  token: string,
  user: UserObjectType,
  pathFragment: string,
  emailTemplate: EmailTemplateType,
  from: string
) => object;
