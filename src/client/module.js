import { Map } from 'immutable';

const PATH = 'js-accounts/';
const LOGIN = `${PATH}LOGIN`;
const SET_USER = `${PATH}SET_USER`;
const LOGGING_IN = `${PATH}/LOGGING_IN`;

const initialState = Map({
  formType: 'login',
  isLoading: false,
  user: null,
  loggingIn: false,
});

const reducer = (state = initialState, action) => {
  const nextState = state;
  switch (action.type) {
    case LOGIN: {
      break;
    }
    case SET_USER: {
      break;
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
  type: loggingIn,
  payload: {
    isLoggingIn,
  },
});
