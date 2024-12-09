// reducers.js
import * as actionTypes from './actionTypes';

const initialState = {
  authUser: [],
  loadAuthUser: true,
  otherStats: [],
  loadOtherStats: true,
  polls: [],
  loadPolls: true,
  errormessage: "Something went wrong!",
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_AUTHUSER:
      return {
        ...state,
        authUser: action.data.authorizedUser,
        loadAuthUser: false,
      };

    case actionTypes.FETCH_AUTHUSER_FAIL:
      return {
        ...state,
        errormessage: "Error fetching authorized user, please check your internet connection",
        loadAuthUser: false,
      };

    case actionTypes.FETCH_OTHERSTATS:
      return {
        ...state,
        otherStats: action.data.otherStats,
        loadOtherStats: false,
      };

    case actionTypes.FETCH_OTHERSTATS_FAIL:
      return {
        ...state,
        errormessage: "Error fetching otherstats data, please check your internet connection",
        loadOtherStats: false,
      };

    case actionTypes.FETCH_SALES:
      return {
        ...state,
        polls: action.data.polls,
        loadPolls: false,
      };

    case actionTypes.FETCH_SALES_FAIL:
      return {
        ...state,
        errormessage: "Error fetching polls data, please check your internet connection",
        loadPolls: false,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
