import 'reflect-metadata';
import { Typeorm } from '../src/typeorm';

describe('Typeorm', () => {
  it('should have named export Typeorm', () => {
    expect(typeof Typeorm).toBe('function');
  });
});
