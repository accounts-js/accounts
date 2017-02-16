import { Map } from 'immutable';

const PATH = 'js-accounts/';
const LOGIN = `${PATH}LOGIN`;
const SET_USER = `${PATH}SET_USER`;
const CLEAR_USER = `${PATH}CLEAR_USER`;
const LOGGING_IN = `${PATH}LOGGING_IN`;

const initialState = Map({
  isLoading: false,
  user: Map(),
  loggingIn: false,
});

const reducer = (state = initialState, action) => {
  const nextState = state;
  switch (action.type) {
    case LOGIN: {
      break;
    }
    case SET_USER: {
      const { user } = action.payload;
      return state.set('user', Map(user));
    }
    case CLEAR_USER: {
      return state.set('user', Map());
    }
    case LOGGING_IN: {
      const { isLoggingIn } = action.payload;
      return state.set('loggingIn', isLoggingIn);
    }
    default:
      break;
  }
  return nextState;
};

export default reducer;

export const loggingIn = isLoggingIn => ({
  type: LOGGING_IN,
  payload: {
    isLoggingIn,
  },
});

export const setUser = user => ({
  type: SET_USER,
  payload: {
    user,
  },
});

export const clearUser = () => ({
  type: CLEAR_USER,
});
