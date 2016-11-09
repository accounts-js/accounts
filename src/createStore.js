import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

export default ({
  reducers = {},
  middleware = [],
  state,
}) =>
  createStore(
    combineReducers(reducers),
    state,
    compose(
      applyMiddleware(...middleware),
    )
  );
