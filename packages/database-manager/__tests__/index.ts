import { DatabaseManager } from '../src';

describe('DatabaseManager entry', () => {
  it('should have named export DatabaseManager', () => {
    expect(typeof DatabaseManager).toBe('function');
  });
});
