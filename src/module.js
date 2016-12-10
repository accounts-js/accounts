import { Map } from 'immutable';

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
