import {
  createStore,
  applyMiddleware,
  compose,
  Store,
  Middleware,
} from 'redux';
import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

export default ({
  reducers = {},
  middleware = [],
  state = Map(),
}: {
  reducers?: object;
  middleware?: Middleware[];
  state?: Map<string, any>;
}) =>
  createStore(
    combineReducers(reducers),
    state,
    compose(applyMiddleware(...middleware))
  );
