class Mongo {
  constructor(options) {
    const defaultOptions = {
      collectionName: 'users',
    };
    this.options = Object.assign({}, defaultOptions, options);
  }

  createUser() { // eslint-disable-line class-methods-use-this
    return Promise.resolve('user');
  }
}

export default Mongo;
