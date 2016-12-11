import createStore from './createStore';
import reducer from './module';

const store = createStore({
  reducers: {
    accounts: reducer,
  },
});

export default store;
