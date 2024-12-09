// store.js
import { createStore, applyMiddleware,combineReducers  } from 'redux';
import thunk from 'redux-thunk';
import signinReducer from './signin/signinReducer';
import dashboardReducer from './dashboard/dashboardReducer';
import requestsReducer from './requests/requestsReducer';

// Combine multiple reducers into a single reducer
const rootReducer = combineReducers({
    signin: signinReducer,
    dashboard: dashboardReducer,
    requests: requestsReducer,
  });
    
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
