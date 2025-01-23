import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'reducers/dashboard/actions';
import { selectDashboardData } from './selectors'; // Import the new selector
import { apiRoutes } from "components/Api/ApiRoutes";
import { useEffect } from 'react';
import { useStateContext } from "context/ContextProvider";
import { passToSuccessLogs, passToErrorLogs } from 'components/Api/Gateway';
import { toast } from "react-toastify";

export function useDashboardData(fetchData) {
  const currentFileName = "layouts/dashboard/data/dashboardRedux.js";

  const {token} = useStateContext();
  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };
  
  const dispatch = useDispatch();

  // Use the new selector to get the dashboardData
  const dashboardData = useSelector(selectDashboardData); 

  // Define your useEffect code for fetching data here
  useEffect(() => {    
    if(fetchData.render == 1) {
      axios.get(apiRoutes.authUserRetrieve, {headers})
        .then(response => {
          dispatch(actions.fetchAuthUser(response.data));
          passToSuccessLogs(response.data, currentFileName);
        })
        .catch(error => {
          toast.error('Somoene just updated your account and you no longer have access on this function. Please re-login.', { autoClose: true });
          passToErrorLogs(`Auth User Data not Fetched!  ${error}`, currentFileName);
        }); 
    }
  }, [fetchData.render, dispatch]); 
  
  //Fetch Otherstats Data
  useEffect(() => {
    if(fetchData.otherStats) {
      axios.get(apiRoutes.otherStatsRetrieve, {headers})
      .then(response => {
        dispatch(actions.fetchOtherStats(response.data));
        passToSuccessLogs(response.data, currentFileName);
      })
      .catch(error => {
        dispatch(actions.fetchOtherStatsFail(error.error));
        passToErrorLogs(`Other Stats Data not Fetched!  ${error}`, currentFileName);
      });
    }
  }, [fetchData.otherStats, dispatch]); // Include dashboardData as a dependency if needed

  //Fetch Admin Notifs Data
  useEffect(() => {
    if(fetchData.adminnotifs || fetchData.render == 1) {
      axios.get(apiRoutes.adminNotifsRetrieve, {headers})
      .then(response => {
        dispatch(actions.fetchAdminNotifs(response.data));
        passToSuccessLogs(response.data, currentFileName);
      })
      .catch(error => {
        dispatch(actions.fetchAdminNotifsFail(error.error));
        passToErrorLogs(`Admin Notifs Data not Fetched!  ${error}`, currentFileName);
      });
    }
  }, [fetchData.adminNotifs, fetchData.render, dispatch]); // Include dashboardData as a dependency if needed

  

  
  return dashboardData;
}
