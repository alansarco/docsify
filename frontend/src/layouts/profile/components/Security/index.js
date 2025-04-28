// React components
import { Checkbox, Grid, Icon, Select, Switch } from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { useLocation, useNavigate } from "react-router-dom";
import { validatePassword } from "components/General/Utils";

function areRequiredFieldsFilled(formData) {
      const requiredFields = [
            "newpass",
            "confirmpass",
      ];
      
      for (const field of requiredFields) {
            if (!formData[field]) {
                  return false;
            }
      }
      return true;
      }
      
function Security() {
      const currentFileName = "layouts/profile/components/Security/index.js";
      const location = useLocation();
      const [submitPass, setSubmitPass] = useState(false);
      const {token} = useStateContext();  
      const [passwordError, setPasswordError] = useState("");
      const navigate = useNavigate();

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };

      const initialState = {
            newpass: "",
            confirmpass: "",
      };

      const [formData, setFormData] = useState(initialState);

      const handleCancel = () => {
            navigate(location.state?.from);
      };

      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
            if (name === "newpass") {
                  setPasswordError(validatePassword(value));
            }
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
            if (areRequiredFieldsFilled(formData)) {
                  setSubmitPass(true);
                  try {
                        if (!token) {
                              toast.error(messages.prohibit, { autoClose: true });
                        }
                        else if (formData.newpass !== formData.confirmpass) {
                              toast.error(messages.passNotMatch, { autoClose: true });
                        }
                        else {  
                              const response = await axios.post(apiRoutes.personalChangePass, formData, {headers});
                              if(response.data.status == 200) {
                                    toast.success(`${response.data.message}`, { autoClose: true });
                              } else {
                                    toast.error(`${response.data.message}`, { autoClose: true });
                              }
                              passToSuccessLogs(response.data, currentFileName);
                        }
                  } catch (error) { 
                        toast.error(messages.changePassError, { autoClose: true });
                        passToErrorLogs(error, currentFileName);
                  }     
                  setSubmitPass(false);
            }
            else {
                  toast.warning(messages.required, { autoClose: true });
            }
      };

      return (  
      <>
            {submitPass && <FixedLoading />}
            <SoftBox mt={5} mb={3} px={2}>      
                  <SoftBox mb={5} p={4} className="shadow-sm rounded-4 bg-white">
                        <SoftTypography fontWeight="medium" color="info" textGradient>
                              Change Password!
                        </SoftTypography>
                        <SoftBox mt={2}>
                              <SoftBox component="form" role="form" className="px-md-0 px-2" onSubmit={handleSubmit}>
                                    <Grid container mt={2} spacing={0} alignItems="top">
                                          <Grid item xs={12} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1 text-nowrap">New Password:</SoftTypography>
                                                <SoftTypography variant="span" className="text-danger text-xs"> *</SoftTypography>
                                                
                                          </Grid>
                                          <Grid item xs={12} md={4} px={1}>
                                                <SoftInput name="newpass"  value={formData.newpass} onChange={handleChange} size="small" /> 
                                                {passwordError && (
                                                      <SoftTypography variant="caption" className="text-danger fw-bold fst-italic">
                                                      {passwordError}
                                                      </SoftTypography>
                                                )}
                                          </Grid>
                                    </Grid>
                                    <Grid container mt={2} spacing={0} alignItems="center">
                                          <Grid item xs={12} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1 text-nowrap">Confirm New Password:</SoftTypography>
                                                <SoftTypography variant="span" className="text-danger text-xs"> *</SoftTypography>
                                          </Grid>
                                          <Grid item xs={12} md={4} px={1}>
                                                <SoftInput name="confirmpass" type="password" value={formData.confirmpass} onChange={handleChange} size="small" /> 
                                          </Grid>
                                    </Grid>
                                    <SoftTypography mt={2} fontWeight="medium" px={1} className=" text-xs text-info">
                                          Note:
                                          <SoftTypography variant="span" className=" ms-2 text-xs text-secondary">Use your new password the next time you login.</SoftTypography>
                                    </SoftTypography> 
                                    <Grid mt={3} container spacing={0} alignItems="center" justifyContent="end">
                                          <Grid item xs={12} sm={4} md={2} pl={1}>
                                                <SoftBox mt={2} display="flex" justifyContent="end">
                                                      <SoftButton onClick={handleCancel} className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small" color="light">
                                                            Back
                                                      </SoftButton>
                                                </SoftBox>
                                          </Grid>
                                          <Grid item xs={12} sm={4} md={2} pl={1}>
                                                <SoftBox mt={2} display="flex" justifyContent="end">
                                                      <SoftButton variant="gradient" type="submit" className="x-2 w-100 text-xxs px-3 rounded-pill" size="small" color="info">
                                                            Update
                                                      </SoftButton>
                                                </SoftBox>
                                          </Grid>
                                    </Grid>     
                              </SoftBox>
                        </SoftBox>
                  </SoftBox>
            </SoftBox>
      </>
      );
}

export default Security;
