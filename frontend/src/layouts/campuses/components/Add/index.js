// React components
import { Checkbox, Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { getN, currentDate } from "components/General/Utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";

function Add({HandleRendering, ReloadTable }) {
      const currentFileName = "layouts/campuses/components/Add/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };
      
      const initialState = {
            clientid: "",
            client_name: "",
            client_acr: "",
            client_email: "",
            client_contact: "",
            client_address: "",
            subscription_start: "",
            license_key: "",
            client_logo: null,
            client_banner: null,
            agreement: false,   
      };

      const [formData, setFormData] = useState(initialState);

      const handleChange = (e) => {
            const { name, value, type, files } = e.target;
    
            if (type === "checkbox") {
                setFormData({ ...formData, [name]: !formData[name] });
            } 
            else if (type === "file" && (name === "client_logo" || name === "client_banner")) {
                const file = files[0];
                if (file && (file.type === "application/png" || 
                        file.type === "image/jpeg" ||
                        file.name.endsWith(".jpg") ||
                        file.name.endsWith(".jpeg") ||
                        file.name.endsWith(".png")
                  )) {
                  if(name === "client_logo") {
                        setFormData({ ...formData, client_logo: file });
                  }
                  else {
                        setFormData({ ...formData, client_banner: file });
                  }
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
            HandleRendering(1);
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
             // Check if all required fields are empty
             const requiredFields = [
                  "clientid",
                  "client_name",
                  "client_acr",
                  "client_email",
                  "client_contact",
                  "client_address",
                  "subscription_start",
                  "license_key",
                  "client_logo",
                  "client_banner",
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
                                    data.append("client_name", formData.client_name);
                                    data.append("client_acr", formData.client_acr);
                                    data.append("client_email", formData.client_email);
                                    data.append("client_contact", formData.client_contact);
                                    data.append("client_address", formData.client_address);
                                    data.append("subscription_start", formData.subscription_start);
                                    data.append("client_logo", formData.client_logo);
                                    data.append("client_banner", formData.client_banner);
                                    data.append("license_key", formData.license_key);
                                    const response = await axios.post(apiRoutes.addCampus, data, {headers});
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
                              toast.error("Error adding Campus!", { autoClose: true });
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
                                          Campus Information    
                                    </SoftTypography>
                                    <Grid container spacing={0} alignItems="center">
                                          <Grid item xs={12} md={6} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> School ID:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="clientid" value={formData.clientid} onChange={handleChange} size="small"
                                                /> 
                                          </Grid>    
                                          <Grid item xs={12} md={6} lg={6} px={1}>
                                                <SoftTypography variant="button" className="me-1">Name:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="client_name" value={formData.client_name} onChange={handleChange} size="small" /> 
                                          </Grid>     
                                          <Grid item xs={12} md={6} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">Acronym:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="client_acr" value={formData.client_acr} onChange={handleChange} size="small" /> 
                                          </Grid>     
                                          <Grid item xs={12} md={6} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Email: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput type="email" name="client_email" value={formData.client_email} onChange={handleChange} size="small" /> 
                                          </Grid>   
                                          <Grid item xs={12} md={6} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Contact Number: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput type="number" name="client_contact" value={getN(formData.client_contact)} onChange={handleChange} size="small" /> 
                                          </Grid>   
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Address:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="client_address" value={formData.client_address} onChange={handleChange} size="small" /> 
                                          </Grid>   
                                          <Grid item xs={12} md={6} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Subscription Start: </SoftTypography>
                                                <SoftTypography variant="span" max={currentDate} className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input className="form-control form-control-sm text-secondary rounded-5"  min={currentDate} name="subscription_start" value={formData.subscription_start} onChange={handleChange} type="date" />
                                          </Grid>
                                          <Grid item xs={12} md={6} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">Logo:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input
                                                      type="file"
                                                      name="client_logo"
                                                      accept="image/*"
                                                      className="form-control form-control-sm rounded-5 text-xs"
                                                      onChange={handleChange}
                                                />
                                          </Grid>  
                                          <Grid item xs={12} md={6} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">Banner:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input
                                                      type="file"
                                                      name="client_banner"
                                                      accept="image/*"
                                                      className="form-control form-control-sm rounded-5 text-xs"
                                                      onChange={handleChange}
                                                />
                                          </Grid>  
                                          <Grid item xs={12} md={6} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">License Key:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input className="form-control form-control-sm text-secondary rounded-5"  name="license_key" value={formData.license_key.toUpperCase()} onChange={handleChange} />
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
