import CUSInMemory from '../src';

const cusInMemory = new CUSInMemory();

describe('CUSInMemory', () => {

  describe('constructor', () => {

    it('should set initialUser config property to the user property', () => {
      const config = { initialUser: 'init' }
      expect(new CUSInMemory(config).user).toBe('init')
    })

  })

  describe('setUser', () => {

    it('should set the parameter to the user property', () => {
      cusInMemory.setUser('user');
      expect(cusInMemory.user).toBe('user')
    })

  })
})