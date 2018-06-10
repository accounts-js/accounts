import { getUserAgent } from '../src/utils/get-user-agent';

describe('getUserAgent util', () => {
  test('should resolve with empty string if nothing found', () => {
    const userAgent = getUserAgent({
      headers: {},
    } as any);

    expect(userAgent).toEqual('');
  });

  test('should use user-agent header', () => {
    const userAgent = getUserAgent({
      headers: {
        'user-agent': 'IE',
      },
    } as any);

    expect(userAgent).toEqual('IE');
  });

  test('should use x-ucbrowser-ua header', () => {
    const userAgent = getUserAgent({
      headers: {
        'x-ucbrowser-ua': 'IE',
      },
    } as any);

    expect(userAgent).toEqual('IE');
  });

  test('should favor x-ucbrowser-ua over user-agent header', () => {
    const userAgent = getUserAgent({
      headers: {
        'user-agent': 'Chrome',
        'x-ucbrowser-ua': 'IE',
      },
    } as any);

    expect(userAgent).toEqual('IE');
  });
});
