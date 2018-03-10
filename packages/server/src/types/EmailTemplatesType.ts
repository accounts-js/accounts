import { EmailTemplateType } from './EmailTemplateType'

export interface EmailTemplatesType {
  from: string;
  verifyEmail: EmailTemplateType;
  resetPassword: EmailTemplateType;
  enrollAccount: EmailTemplateType;
}