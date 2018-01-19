import { emailTemplates } from '../src/email';

describe('email', () => {
  describe('emailTemplates', () => {
    it('should return default subject', () => {
      expect(emailTemplates.verifyEmail.subject()).toMatchSnapshot();
      expect(emailTemplates.resetPassword.subject()).toMatchSnapshot();
      expect(emailTemplates.enrollAccount.subject()).toMatchSnapshot();
    });

    it('should return default text', () => {
      const user: any = {};
      const url = 'url';
      expect(emailTemplates.verifyEmail.text(user, url)).toMatchSnapshot();
      expect(emailTemplates.resetPassword.text(user, url)).toMatchSnapshot();
      expect(emailTemplates.enrollAccount.text(user, url)).toMatchSnapshot();
    });
  });
});