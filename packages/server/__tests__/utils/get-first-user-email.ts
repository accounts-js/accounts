import { getFirstUserEmail } from '../../src/utils/get-first-user-email';

describe('getFirstUserEmail', () => {
  it('should throw errors', () => {
    const user: any = {};
    const email = 'a@b.test';
    expect(() => getFirstUserEmail(user, email)).toThrow();
    expect(() => getFirstUserEmail(user, '')).toThrow();
  });

  it('return the correct email', () => {
    const email = 'a@b.test';
    const email2 = 'c@d.test';
    const user: any = {
      emails: [
        {
          address: email,
        },
        {
          address: email2,
        },
      ],
    };
    expect(getFirstUserEmail(user, '')).toEqual(email);
    expect(getFirstUserEmail(user, email2)).toEqual(email2);
  });
});
