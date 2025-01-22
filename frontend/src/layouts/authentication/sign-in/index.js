import { useEffect, useState } from "react";

// @mui material components
import Checkbox from "@mui/material/Checkbox";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import logo from "assets/images/logo.jpg";

// react-router-dom components
import { Link, useNavigate, Navigate  } from "react-router-dom";
import { useStateContext } from "context/ContextProvider";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import FixedLoading from "components/General/FixedLoading";
import { useSignInData } from "./data/signinRedux";
import MainLoading from "components/General/MainLoading";
import { passToSuccessLogs, passToErrorLogs } from "components/Api/Gateway";
import { isEmpty } from "components/General/Utils"; 
import { messages } from "components/General/Messages";
import { apiRoutes } from "components/Api/ApiRoutes";

function SignIn() {
  const currentFileName = "layouts/authentication/sign-in/index.js";
  const {token,  setUser, setRole, setAccess, setToken, setClientProvider, setClientName, setClientAcr} = useStateContext(); 
  const [submitLogin, setSubmitLogin] = useState(false);
  const [fetchclients, setFetchClients] = useState([]);

  useEffect(() => {
    axios.get(apiRoutes.clientSelect)
    .then(response => {
      setFetchClients(response.data.clients);
      passToSuccessLogs(response.data, currentFileName);
    })
    .catch(error => {
      passToErrorLogs(`Clients not Fetched!  ${error}`, currentFileName);
    });
  }, []);

  const [formData, setFormData] = useState({
    username: 'alsarco7@gmail.com',
    password: 'Sarco123!',
    clientid: '',
  });

  const navigate = useNavigate(); 

  if (token) {
    return <Navigate to="/dashboard" />
  }
  
  const { isLoading, status} = useSignInData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    toast.dismiss();
    if(isEmpty(formData.username) || isEmpty(formData.password)) {
      toast.warning(messages.required, { autoClose: true });
    }
    else {
      setSubmitLogin(true);
      try {
        const response = await axios.post(apiRoutes.login, formData);
        let token = response.data.access_token;
        passToSuccessLogs(response.data.message, currentFileName);
        if (token) {
          setToken(token);
          setUser(response.data.user);
          setRole(response.data.role);
          setAccess(response.data.access);
          setClientProvider(response.data.clientid);
          setClientName(response.data.clientname);
          setClientAcr(response.data.clientacr);
          navigate("/dashboard");
        }
        else {  
          toast.error(`${response.data.message}`, { autoClose: true });
        }
      } catch (error) {
          toast.error(`Login Failed! ${error}`, { autoClose: true });
          passToErrorLogs(error, currentFileName);
      }
      setSubmitLogin(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const HandleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
    {status == 1 && !isLoading ? 
    <>
    {submitLogin && <FixedLoading />}
    <CoverLayout
      title="DOCSIFY"
      description="Login Account"
      image={logo}
    >
      <SoftBox component="form" role="form" onSubmit={handleSubmit}>
        <SoftBox mb={1}>
          <SoftBox ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" color="white" >
              Campus
            </SoftTypography>
          </SoftBox>
          <select disabled={submitLogin} className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="clientid" value={formData.clientid} onChange={handleChange} >
          <option value="">--- Select Campus ---</option>
                {fetchclients && fetchclients.map((school) => (
                <option key={school.clientid} value={school.clientid}>
                    {school.client_name}
                </option>
                ))}
          </select>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" color="white" >
              Username
            </SoftTypography>
          </SoftBox>
          <SoftInput disabled={submitLogin} size="small" type="text"  name="username" value={formData.username} onChange={handleChange}/>
        </SoftBox>
        <SoftBox mb={1}>          
          <SoftBox ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" color="white">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput disabled={submitLogin} size="small" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} />
        </SoftBox>
        <SoftBox mt={2} mb={1}>
          <SoftButton type="submit" size="small" variant="gradient" color="info" fullWidth>
            sign in
          </SoftButton>
        </SoftBox>
        <SoftBox display={{ sm: "flex" }} justifyContent="space-between" textAlign={{ xs: "start", sm: "end" }}>
          <SoftTypography 
              py={1}
              className="text-nowrap text-xxs  text-decoration-underline me-3"
              component={Link}
              to="/authentication/forgot-password"
              color="warning"
              fontWeight="bold"
              // textGradient
            >
              Forgot Password?
          </SoftTypography> 
          <SoftTypography 
              py={1}
              className="text-nowrap text-xxs  text-decoration-underline"
              component={Link}
              to="/authentication/sign-up"
              color="info"
              fontWeight="bold"
              // textGradient
            >
              Create Account?
          </SoftTypography> 
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox display="flex" alignItems="center" py={1}>
              <Checkbox checked={showPassword} onChange={HandleShowPassword} />
              <SoftTypography 
                variant="button"
                className="text-xxs text-nowrap"
                color="white"
                fontWeight="regular"
                onClick={HandleShowPassword}
                sx={{ cursor: "poiner", userSelect: "none" }}
              >
                &nbsp;Show Password
              </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      
    </CoverLayout> 
    </> : <MainLoading />
    }
    <ToastContainer
        position="bottom-right"
        autoClose={5000}
        limit={5}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        theme="light"
      />
    </>
  );
}

export default SignIn;
