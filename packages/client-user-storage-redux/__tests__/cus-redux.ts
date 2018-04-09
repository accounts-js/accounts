import CUSRedux from '../src';
import reducer from '../src/utils/reducer';

class Store {

  public state: any;

  public dispatch(action){
    this.state = reducer(this.state, action)
  }

  public reset(){
    this.state = { user: null }
  }

}
const store = new Store()
const cusRedux = new CUSRedux({
  store
});


beforeEach(store.reset)


describe('CUSRedux', () => {

  describe('constructor', () => {

    it('should set initialUser config property to the user property', () => {
      const config = { initialUser: 'init', store }
      new CUSRedux(config)
      expect(store.state.user).toBe('init')
    })

  })

  describe('setUser', () => {

    it('should set the parameter to the user property', () => {
      cusRedux.setUser('user');
      expect(store.state.user).toBe('user')
    })

  })

  describe('clearUser', () => {

    it('should clear the user property', () => {
      cusRedux.clearUser();
      expect(store.state.user).toBe(undefined)
    })

  })

  describe('reducer', () => {

    it('should return default state when no action match', () => {
      expect(reducer('test', '')).toBe('test')
    })

  })
})