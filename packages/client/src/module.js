import { Map } from 'immutable';

const PATH = 'js-accounts/';
const LOGIN = `${PATH}LOGIN`;
const SET_USER = `${PATH}SET_USER`;
const SET_TOKENS = `${PATH}SET_TOKENS`;
const CLEAR_TOKENS = `${PATH}CLEAR_TOKENS`;
const CLEAR_USER = `${PATH}CLEAR_USER`;
const LOGGING_IN = `${PATH}LOGGING_IN`;
// const TRYING_IMPERSONATE = `${PATH}TRY_IMPERSONATE`;
const IMPERSONATING = `${PATH}IMPERSONATING`;

const initialState = Map({
  isLoading: false,
  user: null,
  tokens: null,
  loggingIn: false,
  impersonating: null
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
    case SET_TOKENS: {
      const { tokens } = action.payload;
      return state.set('tokens', Map(tokens));
    }
    case CLEAR_TOKENS: {
      return state.set('tokens', null);
    }
    case CLEAR_USER: {
      return state.set('user', null);
    }
    case LOGGING_IN: {
      const { isLoggingIn } = action.payload;
      return state.set('loggingIn', isLoggingIn);
    }
    // case TRYING_IMPERSONATE: {
    //   const { tryingImpersonate } = action.payload;
    //   return state.set('tryingImpersonate', tryingImpersonate);
    // }
    case IMPERSONATING: {
      const { user } = action.payload;
      return state.set('impersonating', user);
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

export const setTokens = tokens => ({
  type: SET_TOKENS,
  payload: {
    tokens,
  },
});

export const clearTokens = () => ({
  type: CLEAR_TOKENS,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

// export const tryingImpersonate = isTrying => ({
//   type: TRYING_IMPERSONATE,
//   payload :{
//     isTrying,
//   },
// });
//
export const impersonating = user => ({
  type: IMPERSONATING,
  payload :{
    user,
  },
});