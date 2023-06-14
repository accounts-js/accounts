import 'reflect-metadata';
import AccountsServer from '../src';

describe('AccountsServer', () => {
  it('should have default export AccountsServer', () => {
    expect(typeof AccountsServer).toBe('function');
  });
});
