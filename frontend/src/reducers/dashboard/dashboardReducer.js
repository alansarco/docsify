// reducers.js
import * as actionTypes from './actionTypes';

const initialState = {
  authUser: [],
  loadAuthUser: true,
  otherStats: [],
  loadOtherStats: true,
  adminnotifs: [],
  loadAdminNotifs: true,
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

    case actionTypes.FETCH_ADMIN_NOTIFS:
      return {
        ...state,
        adminnotifs: action.data.adminnotifs,
        loadAdminNotifs: false,
      };

    case actionTypes.FETCH_ADMIN_NOTIFS_FAIL:
      return {
        ...state,
        errormessage: "Error fetching admin notifications, please check your internet connection",
        loadAdminNotifs: false,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
