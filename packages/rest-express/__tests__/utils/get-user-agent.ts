import { getUserAgent } from '../../src/utils/get-user-agent';

describe('getUserAgent', () => {
  it('should return header user agent', () => {
    const req = {
      headers: {
        'user-agent': 'agent',
      },
    };
    const userAgent = getUserAgent(req);
    expect(userAgent).toBe('agent');
  });

  it('should return header UC Browser user agent', () => {
    const req = {
      headers: {
        'x-ucbrowser-ua': 'agent',
      },
    };
    const userAgent = getUserAgent(req);
    expect(userAgent).toBe('agent');
  });
});
