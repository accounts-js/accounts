import { EmailTemplateType } from './EmailTemplateType'

export type EmailType = EmailTemplateType & { to: string };