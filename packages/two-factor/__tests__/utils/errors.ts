import { errors } from '../../src/utils/errors';

describe('errors', () => {
  it('should have named export errors', () => {
    expect(errors).toMatchSnapshot();
  });
});
