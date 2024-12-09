// reducers.js
import { FETCH_REQUESTS, FETCH_REQUESTS_FAIL } from './actionTypes';

const initialState = {
  requests: [],
  errormessage: "Something went wrong!",
  isLoading: true,
};

const requestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUESTS:
      return {
        ...state,
        requests: action.data.requestors,
        isLoading: false,
      };
    case FETCH_REQUESTS_FAIL:
      return {
        ...state,
        errormessage: "Error fetching data, check your internet connection!",
        isLoading: false,
      };
    default:
      return state;
  }
};

export default requestsReducer;
