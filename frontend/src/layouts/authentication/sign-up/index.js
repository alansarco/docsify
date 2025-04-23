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
import { genderSelect, currentDate, years, gradeSelect, roleSelect, monthSelect, cardyears , getCVV, getCardNumber, subscriptionSelect, formatCurrency } from "components/General/Utils";
import paypal from "assets/images/logos/paypal.png";
import maya from "assets/images/logos/maya.png";
import visa from "assets/images/logos/visa.png";
import mastercard from "assets/images/logos/mastercard.png";
import visamaster from "assets/images/logos/visa-master.png";
import { getLRN, getCampusID } from "components/General/Utils";
import { validatePassword } from "components/General/Utils";
import { getContact } from "components/General/Utils";

function SignUp() {
      const currentFileName = "layouts/authentication/sign-up/index.js";
      const { isLoading, status, rawData} = useSignInData();
      const [sendOTP, setSendOTP] = useState(false);  
      const {token} = useStateContext();  
      const [fetchclients, setFetchClients] = useState([]);
      const [showOptions, setShowOptions] = useState(false);
      const [selectedCampusName, setSelectedCampusName] = useState("");
      const [passwordError, setPasswordError] = useState("");

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
            school_id: null,
            gender: "",
            contact: "",
            birthdate: "",
            address: "",
            grade: "",
            year_enrolled: "",
            email: "",
            otp_code: "",

            cardname: "",
            cardnumber: "",
            cvv: "",
            expmonth: "",
            expyear: "",

            subscription: "",
            client_name: "",
            client_acr: "",
            client_email: "",
            new_clientid: "",

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
            else if (type === "file" && name === "school_id") {
                  const file = files[0];
                  if (file && (file.type === "application/png" || 
                          file.type === "image/jpeg" ||
                          file.name.endsWith(".jpg") ||
                          file.name.endsWith(".jpeg") ||
                          file.name.endsWith(".png")
                    )) {
                      setFormData({ ...formData, school_id: file });
                  } else {
                      toast.error("Only .png and .jpg images are allowed");
                      e.target.value = null;
                  }
            } 
            else {
                  setFormData({ ...formData, [name]: value });
                  if (name === "password") {
                        setPasswordError(validatePassword(value));
                  }
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
            ];
      
          // Add clientid as required only if role is not 999
          if (formData.role == 5) {
              requiredFields.push("clientid");
              requiredFields.push("school_id");
              requiredFields.push("email");
          }
          if (formData.role == 30) {
            requiredFields.push("cardname");
            requiredFields.push("cardnumber");
            requiredFields.push("cvv");
            requiredFields.push("expmonth");
            requiredFields.push("expyear");

            requiredFields.push("subscription");
            requiredFields.push("new_clientid");
            requiredFields.push("client_name");
            requiredFields.push("client_acr");
            requiredFields.push("client_email");
        }
          const emptyRequiredFields = requiredFields.filter(field => !formData[field]);
          if (emptyRequiredFields.length === 0) {
            if(!formData.agreement) {
                  toast.warning(messages.agreement, { autoClose: true });
            }
            else if (!/^\d{3}$/.test(getCVV(formData.cvv)) && formData.role == 30) { 
                  toast.error("CVV must be exactly 3 digits", { autoClose: true });
            }
            else if (!/^\d{16}$/.test(getCardNumber(formData.cardnumber)) && formData.role == 30) { 
                  toast.error("Card number must be exactly 16 digits", { autoClose: true });
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
              data.append("school_id", formData.school_id);
              data.append("gender", formData.gender);
              data.append("contact", formData.contact);
              data.append("birthdate", formData.birthdate);
              data.append("address", formData.address);
              data.append("grade", formData.grade);
              data.append("year_enrolled", formData.year_enrolled);
              data.append("clientid", formData.clientid);
              data.append("email", formData.email);

              data.append("subscription", formData.subscription);
              data.append("new_clientid", formData.new_clientid);
              data.append("client_name", formData.client_name);
              data.append("client_acr", formData.client_acr);
              data.append("client_email", formData.client_email);

            //   axios.post(apiRoutes.signupuser, data) 
              const response = await axios.post(apiRoutes.createOTPverification, data);
              if (response.data.status === 200) {
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
                      confirmButtonText: 'Verify Account',
                      preConfirm: (otp) => {
                          formData.otp_code = otp;
                          data.append("otp_code", formData.otp_code);
                          setSendOTP(true);
                          
                          // Return a promise to keep SweetAlert open during the request
                          return axios.post(apiRoutes.signupuser, data)
                              .then((response) => {
                                  if (response.data.status === 200) {
                                      toast.success(`${response.data.message}`, { autoClose: true });
                                      setSendOTP(false);
                                      passToSuccessLogs(response.data, currentFileName);
                                      setFormData(initialState);
                                      return true; // Allow SweetAlert to close
                                  } else {
                                      toast.error(`${response.data.message}`, { autoClose: true });
                                      setSendOTP(false);
                                      return false; // Keep SweetAlert open
                                  }
                              })
                              .catch((error) => {
                                  setSendOTP(false);
                                  toast.error(messages.addUserError, { autoClose: true });
                                  passToErrorLogs(error, currentFileName);
                                  return false; // Keep SweetAlert open
                              });
                      }
                  });
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
            <SoftBox component="form" role="form" onSubmit={handleSubmit} className="d-flex px-4" height={{ xs: "100%", md: "100vh" }}>      
            <Grid className="m-auto" spacing={3} container maxWidth={{ xs: "100%", md: "1500px" }} >
                  <Grid item xs={12} lg={8}  >
                        <SoftBox mb={5} p={4} className="shadow-sm rounded-4 bg-white">
                              <SoftTypography fontWeight="medium" color="info" textGradient>
                                    Direction!
                              </SoftTypography>
                              <SoftTypography fontWeight="bold" className="text-xs">
                                    Please fill in the required fields. Rest assured that data is secured.     
                              </SoftTypography> 
                              <SoftBox mt={2}>
                                    <SoftBox className="px-md-0 px-2" >
                                          <SoftTypography fontWeight="medium" textTransform="capitalize" color="info" textGradient>
                                                Account Information    
                                          </SoftTypography>
                                          <Grid container spacing={0} alignItems="center">
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                              <SoftTypography variant="button" className="me-1"> Account Type: </SoftTypography>
                                              <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                              <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="role" value={formData.role} onChange={handleChange} >
                                                    <option value="">--- Select ---</option>
                                                    {roleSelect && roleSelect.map((role) => (
                                                    <option key={role.value} value={role.value}>
                                                          {role.desc}
                                                    </option>
                                                    ))}
                                              </select>
                                            </Grid>
                                          </Grid>    
                                          <Grid container spacing={0} alignItems="top">
                                            {formData.role == 5 &&
                                            <>
                                              <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Campus:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftBox position="relative">
                                                      <input
                                                            type="text"
                                                            className="form-control form-select form-select-sm text-secondary rounded-5"
                                                            value={selectedCampusName}
                                                            onFocus={() => setShowOptions(true)}
                                                            onBlur={() => setTimeout(() => setShowOptions(false), 200)}
                                                            onChange={(e) => {
                                                            setSelectedCampusName(e.target.value);
                                                            setFormData({ ...formData, clientid: "" });
                                                            }}
                                                      />
                                                      {showOptions && (
                                                            <SoftBox 
                                                            position="absolute" 
                                                            zIndex={10} 
                                                            width="100%" 
                                                            maxHeight="200px" 
                                                            overflow="auto" 
                                                            className="bg-white rounded-5 shadow"
                                                            >
                                                            {fetchclients
                                                            .filter(school => 
                                                                  school.client_name.toLowerCase().includes(selectedCampusName.toLowerCase())
                                                            )
                                                            .map((school) => (
                                                                  <SoftBox 
                                                                  key={school.clientid}
                                                                  px={2} 
                                                                  py={1} 
                                                                  className="text-xs cursor-pointer hover:bg-gray-200 py-1"
                                                                  onMouseDown={() => {
                                                                  setFormData({ ...formData, clientid: school.clientid });
                                                                  setSelectedCampusName(school.client_name); 
                                                                  setShowOptions(false);
                                                                  }}
                                                                  >
                                                                  {school.client_name}
                                                                  </SoftBox>
                                                            ))}
                                                            {fetchclients.filter(school => 
                                                            school.client_name.toLowerCase().includes(selectedCampusName.toLowerCase())
                                                            ).length === 0 && (
                                                            <SoftBox px={2} py={1} className="text-xxs text-gray-500">
                                                                  No campus found
                                                            </SoftBox>
                                                            )}
                                                            </SoftBox>
                                                      )}
                                                      </SoftBox>
                                              </Grid> 
                                            </>
                                            }
                                                
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> {formData.role == 5 ? "LRN:" : "Email Address:"}</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput name="username" type={formData.role == 5 ? "number" : "email"} value={formData.role == 5 ? getLRN(formData.username) : formData.username} onChange={handleChange} size="small"
                                                  /> 
                                            </Grid> 
                                            <Grid item xs={12} md={6} lg={5} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Password:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput name="password" value={formData.password} onChange={handleChange} size="small" /> 
                                                  {passwordError && (
                                                      <SoftTypography variant="caption" className="text-danger fw-bold fst-italic">
                                                      {passwordError}
                                                      </SoftTypography>
                                                      )}
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
                                                  <SoftTypography variant="button" className="me-1">Profile Picture:</SoftTypography>
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
                                                  <SoftInput type="number" name="contact" value={getContact(formData.contact)} onChange={handleChange} size="small" /> 
                                            </Grid> 
                                            {formData.role == 5 &&
                                            <Grid item xs={12} md={6} lg={5} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Email: </SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput type="email" name="email" value={formData.email} onChange={handleChange} size="small" /> 
                                            </Grid> 
                                            }
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
                                            <Grid item xs={12} md={6} lg={2} px={1}>
                                                  <SoftTypography variant="button" className="me-1 text-nowrap"> Year Enrolled: </SoftTypography>
                                                  <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="year_enrolled" value={formData.year_enrolled} onChange={handleChange} >
                                                        <option value=""></option>
                                                        {years && years.map((year) => (
                                                        <option key={year} value={year}>
                                                              {year}
                                                        </option>
                                                        ))}
                                                  </select>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} px={1}>
                                                  <SoftTypography variant="button" className="me-1">School ID:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <input
                                                        type="file"
                                                        name="school_id"
                                                        accept="image/*"
                                                        className="form-control form-control-sm rounded-5 text-xs"
                                                        onChange={handleChange}
                                                  />
                                            </Grid> 
                                            </>
                                            }
                                          </Grid> 
                                          {formData.role == 30 &&
                                          <>
                                          <SoftTypography mt={3} fontWeight="medium" textTransform="capitalize" color="info" textGradient>
                                                Campus Information    
                                          </SoftTypography> 
                                          <Grid container spacing={0} alignItems="center">
                                          
                                            <Grid item xs={12} px={1}>
                                                <ul className="text-danger fw-bold">
                                                      <li className="text-xxs fst-italic">You may complete campus information after successful signup</li>
                                                </ul>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={3} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Campus ID:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>                                                  
                                                  <SoftInput name="new_clientid" value={getCampusID(formData.new_clientid)} onChange={handleChange} size="small" /> 
                                            </Grid>  
                                            <Grid item xs={12} md={6} lg={6} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Campus Name:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput name="client_name" value={formData.client_name} onChange={handleChange} size="small" /> 
                                            </Grid>  
                                            <Grid item xs={12} md={6} lg={3} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Short Name:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput name="client_acr" value={formData.client_acr.toUpperCase()} onChange={handleChange} size="small" /> 
                                            </Grid>  

                                            <Grid item xs={12} md={6} lg={3} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Campus Email:</SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <SoftInput type="email" name="client_email" value={formData.client_email} onChange={handleChange} size="small" /> 
                                            </Grid>  
                                            
                                            <Grid item xs={12} md={6} lg={3} px={1}>
                                                  <SoftTypography variant="button" className="me-1"> Subscription: </SoftTypography>
                                                  <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                  <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="subscription" value={formData.subscription} onChange={handleChange} >
                                                        <option value=""></option>
                                                        {subscriptionSelect && subscriptionSelect.map((sub) => (
                                                        <option key={sub.value} value={sub.value}>
                                                              {sub.desc}
                                                        </option>
                                                        ))}
                                                  </select>
                                            </Grid>
                                            {rawData >= 0 &&
                                            
                                            <Grid item xs={12} md={6} lg={3} px={1}>
                                                  <SoftTypography variant="button" className="me-1">Total Payment:</SoftTypography>
                                                  <SoftInput disabled value={formatCurrency(formData.subscription * (rawData))} size="small" /> 
                                            </Grid>  
                                            }
                                          </Grid>
                                          </>
                                          }
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
                  {formData.role == 30 &&
                  <Grid item xs={12} lg={3} px={1}>
                        <SoftBox mb={5} p={4} className="shadow-sm rounded-4 bg-white">
                              <SoftTypography variant="h3" className="me-1">Payment</SoftTypography>

                              <SoftBox mt={1}>
                                    <SoftTypography variant="h6" className="text-uppercase">Accepted Cards</SoftTypography>
                              </SoftBox>

                              <SoftBox display="flex" mt={1}>
                                    <img src={paypal} alt="paypal" width={50} height={30} className="me-1" />
                                    <img src={maya}  alt="maya" width={50} height={30} className="me-1" />
                                    <img src={visa} alt="visa" width={50} height={30} className="me-1" />
                                    <img src={mastercard} alt="visa" width={50} height={30} className="me-1" />
                              </SoftBox>

                              <SoftBox mt={3}>
                                    <SoftTypography variant="button" className="text-xxs text-uppercase">Name on Card</SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <SoftInput mb={5} name="cardname" value={formData.cardname} onChange={handleChange} size="small" /> 

                                    <SoftTypography variant="button" className="text-xxs text-uppercase">Card Number</SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <SoftInput name="cardnumber" value={getCardNumber(formData.cardnumber)} onChange={handleChange} size="small" /> 
                                    
                                    <SoftTypography variant="button" className="text-xxs text-uppercase">CVV</SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <SoftInput name="cvv" value={getCVV(formData.cvv)} onChange={handleChange} size="small" />
                                    
                                    <SoftTypography variant="button" className="text-xxs text-uppercase">Exp Month:</SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="expmonth" value={formData.expmonth} onChange={handleChange} >
                                          <option value=""></option>
                                          {monthSelect && monthSelect.map((month) => (
                                          <option key={month.value} value={month.value}>
                                                {month.desc}
                                          </option>
                                          ))}
                                    </select>
                             
                                    <SoftTypography variant="button" className="text-xxs text-uppercase">Exp Year:</SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="expyear" value={formData.expyear} onChange={handleChange} >
                                          <option value=""></option>
                                          {cardyears && cardyears.map((year) => (
                                          <option key={year} value={year}>
                                                {year}
                                          </option>
                                          ))}
                                    </select>
                                    
                              </SoftBox>
                        </SoftBox>
                  </Grid>  
                  } 
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
