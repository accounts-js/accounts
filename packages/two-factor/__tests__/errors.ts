import { errors } from '../src/errors';

describe('errors', () => {
  it('should have named export errors', () => {
    expect(errors).toMatchSnapshot();
  });
});
