// reducers.js
import { FETCH_SIGNIN, FETCH_SIGNIN_FAIL } from './actionTypes';

const initialState = {
  app_info: [],
  message: "Something went wrong!",
  status: "",
  isLoading: true,
};

const signinReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SIGNIN:
      return {
        ...state,
        app_info: action.data.app_info,
        message: action.data.message,
        status: action.data.status,
        isLoading: false,
      };
    case FETCH_SIGNIN_FAIL:
      return {
        ...state,
        message: "Error fetching data, check your internet connection!",
      };
    default:
      return state;
  }
};

export default signinReducer;
