import * as src from '../src';

it('should not export anything', () => {
  expect((Object as any).values(src).every(type => type === undefined)).toBe(true);
});
