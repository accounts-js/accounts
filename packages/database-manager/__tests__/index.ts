import DatabaseManager from '../src';

describe('DatabaseManager entry', () => {
  it('should have default export DatabaseManager', () => {
    expect(typeof DatabaseManager).toBe('function');
  });
});
