import { AccountsError } from '../src';

describe('common', () => {
  it('should have named export AccountsError', () => {
    expect(typeof AccountsError).toBe('function');
  })
})