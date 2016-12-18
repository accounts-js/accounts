// @flow

import type { Map } from 'immutable';
import type { Store } from 'redux';

import createStore from './createStore';
import reducer from './module';

const store: Store<Map<string, any>> = createStore({
  reducers: {
    accounts: reducer,
  },
});

export default store;
