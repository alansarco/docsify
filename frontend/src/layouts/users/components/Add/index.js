// React components
import { Checkbox, Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { accessSelect, years, genderSelect, currentDate } from "components/General/Utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";

function Add({HandleRendering, ReloadTable }) {
      const currentFileName = "layouts/users/components/Add/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };
      
      const initialState = {
            username: '',
            name: '',
            gender: '',
            address: '',
            access_level: '',
            contact: '',
            birthdate: '',
            year_residency: '', 
            agreement: false,   
      };

      const [formData, setFormData] = useState(initialState);

      const handleChange = (e) => {
            const { name, value, type } = e.target;
            if (type === "checkbox") {
                  setFormData({ ...formData, [name]: !formData[name]});
            } else {
                  setFormData({ ...formData, [name]: value });
            }
      };

      const handleCancel = () => {
            HandleRendering(1);
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
             // Check if all required fields are empty
             const requiredFields = [
                 "username", 
                  "name", 
                  "address",
                  "gender",
                  "access_level",
                  "contact",
                  "birthdate",
                  "year_residency",
            ];
            const emptyRequiredFields = requiredFields.filter(field => !formData[field]);
            if (emptyRequiredFields.length === 0) {
                  if(!formData.agreement) {
                        toast.warning(messages.agreement, { autoClose: true });
                  }
                  else {      
                        setSubmitProfile(true);
                        try {
                              if (!token) {
                                    toast.error(messages.prohibit, { autoClose: true });
                              }
                              else {  
                                    const response = await axios.post(apiRoutes.accountStore, formData, {headers});
                                    if(response.data.status == 200) {
                                          toast.success(`${response.data.message}`, { autoClose: true });
                                          setFormData(initialState);
                                          ReloadTable();
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    passToSuccessLogs(response.data, currentFileName);
                              }
                        } catch (error) { 
                              toast.error("Error adding Resident!", { autoClose: true });
                              passToErrorLogs(error, currentFileName);
                        }     
                        setSubmitProfile(false);
                  }
                  
            } else {
                  // Display an error message or prevent form submission
                  toast.warning(messages.required, { autoClose: true });
            }
      };

      return (  
      <>
            {submitProfile && <FixedLoading />}   
            <SoftBox mt={5} mb={3} px={2}>      
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
                                          <Grid item xs={12} sm={6} md={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Email:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="username" type="email" value={formData.username.toUpperCase()} onChange={handleChange} size="small"
                                                 /> 
                                                 
                                          </Grid> 
                                    </Grid>    
                                    <SoftTypography fontWeight="medium" textTransform="capitalize" color="info" textGradient>
                                          Personal Information    
                                    </SoftTypography>
                                    <input type="hidden" name="username" value={formData.username} size="small" /> 
                                    <Grid container spacing={0} alignItems="center">
                                          <Grid item xs={12} sm={6} md={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Fullname:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="name" value={formData.name.toUpperCase()} onChange={handleChange} size="small" /> 
                                          </Grid>     
                                          <Grid item xs={12} sm={6} lg={2} px={1}>
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
                                          <Grid item xs={12} sm={6} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Contact Number: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput type="number" name="contact" value={formData.contact} onChange={handleChange} size="small" /> 
                                          </Grid> 
                                          <Grid item xs={12} sm={6} md={4} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Birthdate: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input className="form-control form-control-sm text-secondary rounded-5"  max={currentDate} name="birthdate" value={formData.birthdate} onChange={handleChange} type="date" />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={4} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Address: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input className="form-control form-control-sm text-secondary rounded-5" name="address" value={formData.address} onChange={handleChange} />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Year Residency: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="year_residency" value={formData.year_residency} onChange={handleChange} >
                                                      <option value=""></option>
                                                      {years && years.map((year) => (
                                                      <option key={year} value={year}>
                                                            {year}
                                                      </option>
                                                      ))}
                                                </select>
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Access level: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="access_level" value={formData.access_level} onChange={handleChange} >
                                                      <option value=""></option>
                                                      {accessSelect && accessSelect.map((access) => (
                                                      <option key={access.value} value={access.value}>
                                                            {access.desc}
                                                      </option>
                                                      ))}
                                                </select>
                                          </Grid>
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
                                          <Grid item xs={12} sm={4} md={2} pl={1}>
                                                <SoftBox mt={2} display="flex" justifyContent="end">
                                                      <SoftButton onClick={handleCancel} className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small" color="light">
                                                            Back
                                                      </SoftButton>
                                                </SoftBox>
                                          </Grid>
                                          <Grid item xs={12} sm={4} md={2} pl={1}>
                                                <SoftBox mt={2} display="flex" justifyContent="end">
                                                      <SoftButton variant="gradient" type="submit" className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small" color="info">
                                                            Save
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

export default Add;
