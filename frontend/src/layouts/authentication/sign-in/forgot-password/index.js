import { useState } from "react";

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
import { useSignInData } from "../data/signinRedux";
import MainLoading from "components/General/MainLoading";
import { passToErrorLogs } from "components/Api/Gateway";
import { isEmpty } from "components/General/Utils"; 
import { messages } from "components/General/Messages";
import { apiRoutes } from "components/Api/ApiRoutes";

function ForgotPassword() {
  const currentFileName = "layouts/authentication/sign-in/index.js";
  const {token} = useStateContext(); 
  const [submitLogin, setSubmitLogin] = useState(false);
  const [step, setStep] = useState(1);

  const [formData1, setFormData1] = useState({
    username: '',
  });
  const [formData2, setFormData2] = useState({
    otp: '',
    email: '',
  });
  const [formData3, setFormData3] = useState({
    otp: '',
    newpassword: '',
  });

  const navigate = useNavigate(); 

  if (token) {
    return <Navigate to="/dashboard" />
  }
  
  const { isLoading, status} = useSignInData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData1({ ...formData1, [name]: value });
    setFormData2({ ...formData2, [name]: value });
    setFormData3({ ...formData3, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    toast.dismiss();
    if(isEmpty(formData1.username)) {
      toast.warning(messages.required, { autoClose: true });
    }
    else {
      setSubmitLogin(true);
      try {
        const response = await axios.post(apiRoutes.createOTP, formData1);
        if (response.data.status === 200) {
            toast.success(`${response.data.message}`, { autoClose: true });
            setFormData3(prevFormData => ({
                ...prevFormData,
                email: response.data.email,  
                otp: '', 
            }));
            setStep(2);
        } else {
            toast.error(`${response.data.message}`, { autoClose: true });
        }
      } catch (error) {
          toast.error(`Action  Failed! ${error}`, { autoClose: true });
          passToErrorLogs(error, currentFileName);
      }
      setSubmitLogin(false);
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault(); 
    toast.dismiss();
    if(isEmpty(formData2.otp)) {
      toast.warning(messages.required, { autoClose: true });
    }
    else {
      setSubmitLogin(true);
      try {
        const response = await axios.post(apiRoutes.validateOTP, formData2);
        if (response.data.status === 200) {
            toast.success(`${response.data.message}`, { autoClose: true });
            setFormData3(prevFormData => ({
                ...prevFormData,
                newpassword: '',  
            }));
            setStep(3);
        } else {
            toast.error(`${response.data.message}`, { autoClose: true });
        }
      } catch (error) {
          toast.error(`Action  Failed! ${error}`, { autoClose: true });
          passToErrorLogs(error, currentFileName);
      }
      setSubmitLogin(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault(); 
    toast.dismiss();
    if(isEmpty(formData3.newpassword)) {
      toast.warning(messages.required, { autoClose: true });
    }
    else {
      setSubmitLogin(true);
      try {
        const response = await axios.post(apiRoutes.submitPassword, formData3);
        if (response.data.status === 200) {
            toast.success(`${response.data.message}`, { autoClose: true });
            setStep(4);
        } else {
            toast.error(`${response.data.message}`, { autoClose: true });
        }
      } catch (error) {
          toast.error(`Action  Failed! ${error}`, { autoClose: true });
          passToErrorLogs(error, currentFileName);
      }
      setSubmitLogin(false);
    }
  };

  return (
    <>
    {status == 1 && !isLoading ? 
    <>
    {submitLogin && <FixedLoading />}
    <CoverLayout
      title="DOCSIFY"
      description={step < 4 ? "Forgot Password?" : "Password Chaged Successfully!"} 
      image={logo}
    >
        {step < 4 &&
        <SoftBox ml={0.5} mt={1}>
            <SoftTypography className="text-xs" color="white" >
            STEP {step} of 3
            </SoftTypography>
        </SoftBox>
        }
       
        {step == 1 &&
        <SoftBox component="form" role="form" onSubmit={handleSubmit}>
            <SoftBox mb={1}>
                <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" color="white" >
                    Enter Username
                    </SoftTypography>
                </SoftBox>
                <SoftInput disabled={submitLogin} size="small" type="text"  name="username" value={formData1.username} onChange={handleChange}/>
            </SoftBox>
            <SoftBox mt={2} mb={1}>
                <SoftButton type="submit" size="small" variant="gradient" color="info" fullWidth>
                    submit
                </SoftButton>
            </SoftBox>
        </SoftBox>
        }
        {step == 2 &&
        <SoftBox component="form" role="form" onSubmit={handleSubmitOTP}>
            <SoftBox mb={1}>          
                <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" color="white">
                    Enter OTP
                    </SoftTypography>
                </SoftBox>
                <SoftInput disabled={submitLogin} size="small" name="otp" value={formData2.otp} onChange={handleChange} />
            </SoftBox>
            <SoftBox mt={2} mb={1}>
                <SoftButton type="submit" size="small" variant="gradient" color="info" fullWidth>
                    submit
                </SoftButton>
            </SoftBox>
            <SoftBox mb={1}>
                <SoftButton onClick={() => setStep(1)} size="small" variant="gradient" color="secondary" fullWidth>
                    Did not receive code?
                </SoftButton>
            </SoftBox>
        </SoftBox>
        }
        {step == 3 &&
        <SoftBox component="form" role="form" onSubmit={handleSubmitPassword}>
            <SoftBox mb={1}>          
                <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" color="white">
                    Set New Password
                    </SoftTypography>
                </SoftBox>
                <SoftInput disabled={submitLogin} size="small" name="newpassword" value={formData3.newpassword} onChange={handleChange} />
            </SoftBox>
            <SoftBox mt={2} mb={1}>
                <SoftButton type="submit" size="small" variant="gradient" color="info" fullWidth>
                    submit
                </SoftButton>
            </SoftBox>
        </SoftBox>
        }
        {step == 4 &&
        <SoftBox mb={1} mt={3}>         
            <SoftButton onClick={() => navigate("/authentication/sign-in")} size="small" variant="gradient" color="info" fullWidth>
                BACK TO LOGIN
            </SoftButton>
        </SoftBox>
        }
        {step < 4 &&
        <SoftBox display={{ sm: "flex" }} justifyContent="space-between" textAlign={{ xs: "start", sm: "end" }}>
            <SoftTypography 
                py={1}
                className="text-nowrap text-xxs  text-decoration-underline"
                component={Link}
                to="/authentication/sign-in"
                color="warning"
                fontWeight="medium"
                >
                Back to Login?
            </SoftTypography> 
        </SoftBox>
        }
        
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

export default ForgotPassword;
