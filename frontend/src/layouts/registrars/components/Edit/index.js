// React components
import { Checkbox, Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { statusSelect, getN, genderSelect, currentDate } from "components/General/Utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";

function Edit({USER, HandleRendering, UpdateLoading, ReloadTable }) {
      const currentFileName = "layouts/users/components/Edit/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token, clientprovider} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };

      const initialState = {
            username: USER.username,
            clientid: clientprovider,
            first_name: USER.first_name == null ? "" : USER.first_name,
            middle_name: USER.middle_name == null ? "" : USER.middle_name,
            last_name: USER.last_name == null ? "" : USER.last_name,
            address: USER.address == null ? "" : USER.address,
            gender: USER.gender == null ? "" : USER.gender,
            email: USER.email == null ? "" : USER.email,
            contact: USER.contact == null ? "" : USER.contact,
            birthdate: USER.birthdate == null ? "" : USER.birthdate,
            account_status: USER.account_status == null ? "" : USER.account_status, 
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

      const handleCancel = () => {
            ReloadTable();
            HandleRendering(1);
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
             // Check if all required fields are empty
             const requiredFields = [
                  "clientid",
                  "username",
                  "first_name",
                  "last_name",
                  "gender",
                  "contact",
                  "birthdate",
                  "address",
                  "email",
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
                                    const data = new FormData();
                                    data.append("clientid", formData.clientid);
                                    data.append("username", formData.username);
                                    data.append("first_name", formData.first_name);
                                    data.append("middle_name", formData.middle_name);
                                    data.append("last_name", formData.last_name);
                                    data.append("id_picture", formData.id_picture);
                                    data.append("gender", formData.gender);
                                    data.append("contact", formData.contact);
                                    data.append("birthdate", formData.birthdate);
                                    data.append("address", formData.address);
                                    data.append("email", formData.email);
                                    data.append("account_status", formData.account_status);
                                    const response = await axios.post(apiRoutes.updateRegistrar, data, {headers});
                                    if(response.data.status == 200) {
                                          toast.success(`${response.data.message}`, { autoClose: true });
                                          // setFormData(initialState);
                                          ReloadTable();
                                          UpdateLoading(true);
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    passToSuccessLogs(response.data, currentFileName);
                              }
                        } catch (error) { 
                              toast.error("Error updating registrar!", { autoClose: true });
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
                                                <SoftInput type="number" name="contact" value={getN(formData.contact)} onChange={handleChange} size="small" /> 
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
                                          <Grid item xs={12} sm={6} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Account Status: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="account_status" value={formData.account_status} onChange={handleChange} >
                                                      <option value=""></option>
                                                      {statusSelect && statusSelect.map((status) => (
                                                      <option key={status.value} value={status.value}>
                                                            {status.desc}
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

export default Edit;
