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
import { Link, useNavigate, Navigate  } from "react-router-dom";
import { useSignInData } from "../sign-in/data/signinRedux";
import { apiRoutes } from "components/Api/ApiRoutes";
import MainLoading from "components/General/MainLoading";
import { genderSelect, currentDate, years, gradeSelect, roleSelect } from "components/General/Utils";

function SignUp() {
      const currentFileName = "layouts/authentication/sign-up/index.js";
      const { isLoading, status} = useSignInData();

      const [sendOTP, setSendOTP] = useState(false);  
      const {token} = useStateContext();  
      const [fetchclients, setFetchClients] = useState([]);

      if (token) {
        return <Navigate to="/dashboard" />
      }
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

      const initialState = {
            role: "",
            clientid: "",
            username: "",
            password: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            id_picture: null,
            gender: "",
            contact: "",
            birthdate: "",
            address: "",
            grade: "",
            section: "",
            program: "",
            year_enrolled: "",
            email: "",
            otp_code: "",
            agreement: false,   
      };

      const [formData, setFormData] = useState(initialState);

      const handleChange = (e) => {
            const { name, value, type, files } = e.target;
    
            if (type === "checkbox") {
                setFormData({ ...formData, [name]: !formData[name] });
            } 
            else if (type === "file" && name === "id_picture") {
                  const file = files[0];
                  if (file && (file.type === "application/png" || 
                          file.type === "image/jpeg" ||
                          file.name.endsWith(".jpg") ||
                          file.name.endsWith(".jpeg") ||
                          file.name.endsWith(".png")
                    )) {
                      setFormData({ ...formData, id_picture: file });
                  } else {
                      toast.error("Only .png and .jpg images are allowed");
                      e.target.value = null;
                  }
            } 
            else {
                  setFormData({ ...formData, [name]: value });
            }
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
            // Check if all required fields are empty
            let requiredFields = [
              "role",
              "username",
              "password",
              "first_name",
              "last_name",
              "id_picture",
              "gender",
              "contact",
              "birthdate",
              "address",
              "email",
          ];
      
          // Add clientid as required only if role is not 999
          if (formData.role != 999) {
              requiredFields.push("clientid");
          }
          const emptyRequiredFields = requiredFields.filter(field => !formData[field]);

          if (emptyRequiredFields.length === 0) {
            if(!formData.agreement) {
              toast.warning(messages.agreement, { autoClose: true });
            }
            else {    
              setSendOTP(true);
              const data = new FormData();
              data.append("role", formData.role);
              data.append("username", formData.username);
              data.append("password", formData.password);
              data.append("first_name", formData.first_name);
              data.append("middle_name", formData.middle_name);
              data.append("last_name", formData.last_name);
              data.append("id_picture", formData.id_picture);
              data.append("gender", formData.gender);
              data.append("contact", formData.contact);
              data.append("birthdate", formData.birthdate);
              data.append("address", formData.address);
              data.append("grade", formData.grade);
              data.append("section", formData.section);
              data.append("program", formData.program);
              data.append("year_enrolled", formData.year_enrolled);
              data.append("clientid", formData.clientid);
              data.append("email", formData.email);
              axios.post(apiRoutes.signupuser, data)      
              const response = await axios.post(apiRoutes.createOTPverification, data);
              if(response.data.status == 200) {
                setSendOTP(false);
                Swal.fire({
                  customClass: {
                    title: 'alert-title',
                    icon: 'alert-icon',
                    confirmButton: 'alert-confirmButton',
                    cancelButton: 'alert-cancelButton',
                    container: 'alert-container',
                    input: 'alert-input',
                    popup: 'alert-popup'
                  },
                  title: 'Account Confirmation',
                  input: "text",
                  text: "A verification message is sent to your email. Enter valid OTP to verify your account!",
                  icon: 'warning',        
                  showCancelButton: true,
                  allowOutsideClick: false,
                  confirmButtonColor: '#3085d6',  
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Verify Account'
                }).then((result) => {
                  if (result.isConfirmed) {
                        formData.otp_code = result.value;
                        data.append("otp_code", formData.otp_code);
                        setSendOTP(true);
                        try {
                              axios.post(apiRoutes.signupuser, data)      
                              .then((response) => {
                                    if (response.data.status === 200) {
                                          toast.success(`${response.data.message}`, { autoClose: true });
                                          
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    // setFormData(initialState);
                                    setSendOTP(false);
                                    passToSuccessLogs(response.data, currentFileName);
                              })
                              .catch((error) => {
                                    setSendOTP(false);
                                    toast.error(messages.addUserError, { autoClose: true });
                                    passToErrorLogs(error, currentFileName);
                              });
                        } catch (error) { 
                              setSendOTP(false);
                              toast.error(messages.addUserError, { autoClose: true });
                              passToErrorLogs(error, currentFileName);
                        }     
                  }
                })
              } else {
                setSendOTP(false);
                toast.error(`${response.data.message}`, { autoClose: true });
              }  
            }
          } else {  
              // Display an error message or prevent form submission
              toast.warning(messages.required, { autoClose: true });
          }
      };

      return (  
        <>  
        {status == 1 && !isLoading ? 
        <>
            {sendOTP && <FixedLoading />}     
            <SoftBox className="d-flex px-4 py-4 border" height={{ xs: "100%", md: "100vh" }}>      
            <Grid className="m-auto" container maxWidth={{ xs: "100%", md: "1500px" }} justifyContent="center">
                  <Grid item xs={12} lg={8} className="m-auto" >
                        <SoftBox mb={5} p={4} className="shadow-sm rounded-4 bg-white">
                              <SoftTypography fontWeight="medium" color="info" textGradient>
                                    Direction!
                              </SoftTypography>
                              <SoftTypography fontWeight="bold" className="text-xs">
                                    Please fill in the required fields. Rest assured that data is secured.     
                              </SoftTypography> 
                              <SoftBox mt={2}>
                                    <SoftBox component="form" role="form" className="px-md-0 px-2" onSubmit={handleSubmit}>
                                          <SoftTypography fontWeight="medium" textTransform="capitalize" color="info" textGradient>
                                                Account Information    
                                          </SoftTypography>
                                          <Grid container spacing={0} alignItems="center">
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                              <SoftTypography variant="button" className="me-1"> Role: </SoftTypography>
                                              <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                              <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="role" value={formData.role} onChange={handleChange} >
                                                    <option value="">--- Select Role ---</option>
                                                    {roleSelect && roleSelect.map((role) => (
                                                    <option key={role.value} value={role.value}>
                                                          {role.desc}
                                                    </option>
                                                    ))}
                                              </select>
                                            </Grid>
                                          </Grid>    
                                          <Grid container spacing={0} alignItems="center">
                                            {formData.role != 999 &&
                                            <>
                                              <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Campus:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="clientid" value={formData.clientid} onChange={handleChange} >
                                                  <option value="">--- Select Campus ---</option>
                                                        {fetchclients && fetchclients.map((school) => (
                                                        <option key={school.clientid} value={school.clientid}>
                                                              {school.client_name}
                                                        </option>
                                                        ))}
                                                  </select>
                                              </Grid> 
                                            </>
                                            }
                                                
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> {formData.role == 5 ? "LRN:" : "Username:"}</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput name="username" type={formData.role == 5 ? "number" : "text"} value={formData.username} onChange={handleChange} size="small"
                                                  /> 
                                            </Grid> 
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Password:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput name="password" value={formData.password} onChange={handleChange} size="small" /> 
                                            </Grid>     
                                          </Grid>    
                                          <SoftTypography mt={3} fontWeight="medium" textTransform="capitalize" color="info" textGradient>
                                                Personal Information    
                                          </SoftTypography>
                                          <input type="hidden" name="username" value={formData.username} size="small" /> 
                                          <Grid container spacing={0} alignItems="center">
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Firstname:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput name="first_name" value={formData.first_name.toUpperCase()} onChange={handleChange} size="small" /> 
                                            </Grid>     
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Middle Name:</SoftTypography>
                                                  <SoftInput name="middle_name" value={formData.middle_name.toUpperCase()} onChange={handleChange} size="small" /> 
                                            </Grid>     
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Last Name:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput name="last_name" value={formData.last_name.toUpperCase()} onChange={handleChange} size="small" /> 
                                            </Grid>         
                                            <Grid item xs={12} md={6} lg={2} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Gender: </SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="gender" value={formData.gender} onChange={handleChange} >
                                                        <option value=""></option>
                                                        {genderSelect && genderSelect.map((gender) => (
                                                        <option key={gender.value} value={gender.value}>
                                                              {gender.desc}
                                                        </option>
                                                        ))}
                                                  </select>
                                            </Grid>
                                            <Grid item xs={12} lg={6} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Address: </SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <input className="form-control form-control-sm text-secondary rounded-5" name="address" value={formData.address} onChange={handleChange} />
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1">ID Picture:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <input
                                                        type="file"
                                                        name="id_picture"
                                                        accept="image/*"
                                                        className="form-control form-control-sm rounded-5 text-xs"
                                                        onChange={handleChange}
                                                  />
                                            </Grid>  
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Contact Number: </SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput type="number" name="contact" value={formData.contact} onChange={handleChange} size="small" /> 
                                            </Grid> 
                                            <Grid item xs={12} md={6} lg={5} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Email: </SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput type="email" name="email" value={formData.email} onChange={handleChange} size="small" /> 
                                            </Grid> 
                                            <Grid item xs={12} md={6} lg={3} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Birthdate: </SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <input className="form-control form-control-sm text-secondary rounded-5"  max={currentDate} name="birthdate" value={formData.birthdate} onChange={handleChange} type="date" />
                                            </Grid>
                                            {formData.role == 5 &&
                                            <>
                                            <Grid item xs={12} md={6} lg={2} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Grade: </SoftTypography>
                                                  <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="grade" value={formData.grade} onChange={handleChange} >
                                                        <option value=""></option>
                                                        {gradeSelect && gradeSelect.map((grade) => (
                                                        <option key={grade.value} value={grade.value}>
                                                              {grade.desc}
                                                        </option>
                                                        ))}
                                                  </select>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={3} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Section:</SoftTypography>
                                                  <SoftInput name="section" value={formData.section.toUpperCase()} onChange={handleChange} size="small" /> 
                                            </Grid>  
                                            <Grid item xs={12} md={6} lg={5} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Program:</SoftTypography>
                                                  <SoftInput name="program" value={formData.program.toUpperCase()} onChange={handleChange} size="small" /> 
                                            </Grid>  
                                            <Grid item xs={12} md={6} lg={2} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Year Enrolled: </SoftTypography>
                                                  <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="year_enrolled" value={formData.year_enrolled} onChange={handleChange} >
                                                        <option value=""></option>
                                                        {years && years.map((year) => (
                                                        <option key={year} value={year}>
                                                              {year}
                                                        </option>
                                                        ))}
                                                  </select>
                                            </Grid>
                                            </>
                                            }
                                            
                                          </Grid>  
                                          <Grid mt={3} container spacing={0} alignItems="center">
                                            <Grid item xs={12} pl={1}>
                                                  <Checkbox 
                                                        className={` ${formData.agreement ? '' : 'border-2 border-info'}`} 
                                                        name="agreement" 
                                                        checked={formData.agreement} 
                                                        onChange={handleChange} 
                                                  />
                                                  <SoftTypography variant="button" className="me-1 ms-2">Verify Data </SoftTypography>
                                                  <SoftTypography variant="p" className="text-xxs text-secondary fst-italic">(Confirming that the information above are true and accurate) </SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                            </Grid>
                                          </Grid>
                                          <Grid mt={3} container spacing={0} alignItems="center" justifyContent="end">
                                            <Grid item xs={12} md={4} lg={2} pl={1}>
                                                  <SoftBox mt={2} display="flex" justifyContent="end">
                                                        <SoftButton component={Link} to="/authentication/sign-in" className="mx-2 w-100 text-nowrap rounded-pill" size="small" color="light">
                                                              Go to Signin
                                                        </SoftButton>
                                                  </SoftBox>
                                            </Grid>
                                            <Grid item xs={12} md={4} lg={2} pl={1}>
                                                  <SoftBox mt={2} display="flex" justifyContent="end">
                                                        <SoftButton variant="gradient" color="info" type="submit" className="mx-2 w-100 rounded-pill" size="small">
                                                              Save
                                                        </SoftButton>
                                                  </SoftBox>
                                            </Grid>
                                          </Grid>     
                                    </SoftBox>
                              </SoftBox>
                        </SoftBox>
                  </Grid>
            </Grid>
                  
            </SoftBox>
        </>
        :  <MainLoading /> }
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

export default SignUp;
