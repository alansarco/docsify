import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'reducers/signin/actions';
import { selectSignInData } from './selectors'; // Import the new selector
import { apiRoutes } from "components/Api/ApiRoutes";
import { useEffect } from 'react';
import { useStateContext } from "context/ContextProvider";
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { passToSuccessLogs, passToErrorLogs } from 'components/Api/Gateway';
import { messages } from "components/General/Messages";

export function useSignInData() {
  const currentFileName = "layouts/authentication/sign-in/data/signinRedux.js";
  const {user, token} = useStateContext();
  const { pathname } = useLocation();
  const navigate = useNavigate(); 

  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };
  
  const dispatch = useDispatch();
  const isSignInOrSignUp = pathname === "/authentication/sign-in" || pathname === "/authentication/sign-up";

  // Use the new selector to get the ResidentData
  const SignInData = useSelector(selectSignInData);

  useEffect(() => {
      axios.get(apiRoutes.app_infoRetrieve, {headers})
        .then(response => {
            dispatch(actions.fetchSignIn(response.data));
            passToSuccessLogs(response.data, currentFileName);
            if (response.data.status == 1) {
              if(isSignInOrSignUp) {
                // toast.success(`${response.data.message}`, { autoClose: true });
              }
            }
            else {
              if(isSignInOrSignUp) {
                // toast.error(`${response.data.message}`, { autoClose: true });
              }
            }
        })
        .catch(error => {
            dispatch(actions.fetchSignInFail(error));
            passToErrorLogs(error, currentFileName);
            if(isSignInOrSignUp)
              toast.error(messages.app_infoError, { autoClose: true });
              if(!token) {
                navigate("/authentication/sign-in");
              }
              
        });
    }, [dispatch]);
    
  return SignInData;
}
