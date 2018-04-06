import EmailNSMailgun from '../src';

describe('EmailNSMailgun entry', () => {
  it('should have default export EmailNSMailgun', () => {
    expect(typeof EmailNSMailgun).toBe('function');
  });
});
