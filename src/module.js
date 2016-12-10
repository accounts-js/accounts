import { Map } from 'immutable';

const PATH = 'js-accounts/';
const LOGIN = `${PATH}LOGIN`;
const SET_USER = `${PATH}SET_USER`;

const initialState = Map({
  formType: 'login',
  isLoading: false,
  user: null,
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
    default:
      break;
  }
  return nextState;
};

export default reducer;
