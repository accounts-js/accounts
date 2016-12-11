import { createStore, applyMiddleware, compose } from 'redux';
import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

export default ({
  reducers = {},
  middleware = [],
  state = Map(),
}) => createStore(
  combineReducers(reducers),
  state,
  compose(
    applyMiddleware(...middleware),
  ),
);
