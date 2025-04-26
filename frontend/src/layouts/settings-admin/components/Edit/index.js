// React components
import { Checkbox, Grid, Switch} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { getN } from "components/General/Utils";
import { getContact } from "components/General/Utils";

function Edit({DATA, HandleRendering, UpdateLoading, ReloadTable }) {
      const currentFileName = "layouts/users/components/Edit/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };
      
      const initialState = {
            system_id: DATA.system_id == null ? "" : DATA.system_id,
            price_per_day: DATA.price_per_day == null ? "" : DATA.price_per_day,
            system_logo: DATA.logo == null ? null : DATA.logo,
            system_contact: DATA.contact == null ? "" : DATA.contact,
            system_email: DATA.email == null ? "" : DATA.email,
            system_security_code: DATA.security_code == null ? "" : DATA.security_code,
            system_admin_limit: DATA.superadmin_limit == null ? "" : DATA.superadmin_limit,
            system_info: DATA.system_info == null ? "" : DATA.system_info,
            notify_campus_add: DATA.notify_campus_add == 1 ? true : false,
            notify_campus_renew: DATA.notify_campus_renew == 1 ? true : false,
            notify_user_approve: DATA.notify_user_approve == 1 ? true : false,
            notify_user_reject: DATA.notify_user_reject== 1 ? true : false,
            agreement: false,   
      };

      const [formData, setFormData] = useState(initialState);

      const handleChange = (e) => {
            const { name, value, type, files } = e.target;
    
            if (type === "checkbox") {
                setFormData({ ...formData, [name]: !formData[name] });
            } 
            else if (type === "file" && (name === "client_logo" || name === "client_banner" || name === "system_logo")) {
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
                    else if(name === "client_banner") {
                          setFormData({ ...formData, client_banner: file });
                    }
                    else {
                          setFormData({ ...formData, system_logo: file });
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
            ReloadTable();
            HandleRendering(1);
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
             // Check if all required fields are empty
             const requiredFields = [
                  "system_id",
                  "system_contact",
                  "system_email",
                  "system_security_code",
                  "system_admin_limit",
                  "system_info",
                  "price_per_day",
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
                                    data.append("system_id", formData.system_id);
                                    data.append("system_logo", formData.system_logo);
                                    data.append("system_contact", formData.system_contact);
                                    data.append("system_email", formData.system_email);
                                    data.append("system_security_code", formData.system_security_code);
                                    data.append("system_admin_limit", formData.system_admin_limit);
                                    data.append("system_info", formData.system_info);
                                    data.append("notify_campus_add", formData.notify_campus_add);
                                    data.append("notify_campus_renew", formData.notify_campus_renew);
                                    data.append("notify_user_approve", formData.notify_user_approve);
                                    data.append("notify_user_reject", formData.notify_user_reject);
                                    data.append("price_per_day", formData.price_per_day);
                                    const response = await axios.post(apiRoutes.updateAdminSettings, data, {headers});
                                    if(response.data.status == 200) {
                                          toast.success(`${response.data.message}`, { autoClose: true });
                                          ReloadTable();
                                          HandleRendering(1);
                                          UpdateLoading(true);
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    passToSuccessLogs(response.data, currentFileName);
                              }
                        } catch (error) { 
                              toast.error("Error updating settings!", { autoClose: true });
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
                                    <Grid container spacing={0} alignItems="center">
                                          <input type="hidden" name="system_id" value={formData.system_id} size="small" /> 
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Contact:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="system_contact" type="number" value={getContact(formData.system_contact)} onChange={handleChange} size="small" />
                                          </Grid>  
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Email:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="system_email" type="email" value={formData.system_email} onChange={handleChange} size="small" />
                                          </Grid>  
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Security Code:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="system_security_code" value={formData.system_security_code} onChange={handleChange} size="small" />
                                          </Grid>  
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Admin Limit:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput type="number" name="system_admin_limit" value={formData.system_admin_limit} onChange={handleChange} size="small" />
                                          </Grid>  
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Logo:</SoftTypography>
                                                <input
                                                      type="file"
                                                      name="system_logo"
                                                      accept="image/*"
                                                      className="form-control form-control-sm rounded-5 text-xs"
                                                      onChange={handleChange}
                                                />
                                          </Grid>  
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Price (per day):</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="price_per_day" value={getN(formData.price_per_day)} onChange={handleChange} size="small" />
                                          </Grid>  
                                          <Grid item xs={12} px={1}>
                                                <SoftTypography variant="button" className="me-1">System Information:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <textarea name="system_info" value={formData.system_info} onChange={handleChange} className="form-control text-xs" rows="10"></textarea>
                                          </Grid>  
                                    </Grid>  
                                    <Grid mt={3} container spacing={0} alignItems="center">
                                          <Grid item xs={12} pl={1}>
                                                <Switch name="notify_campus_add" checked={formData.notify_campus_add} onChange={handleChange} />
                                                <SoftTypography variant="button" className="me-1 ms-3">Notify campus when added? </SoftTypography>
                                                <SoftTypography variant="p" className="text-xxs text-secondary fst-italic">(Campus will receive email notification once their institution is added to the server)</SoftTypography>
                                          </Grid> 
                                          <Grid item xs={12} pl={1}>
                                                <Switch name="notify_campus_renew" checked={formData.notify_campus_renew} onChange={handleChange} />
                                                <SoftTypography variant="button" className="me-1 ms-3">Notify campus when license renewed? </SoftTypography>
                                                <SoftTypography variant="p" className="text-xxs text-secondary fst-italic">(Campus will receive email notification once their institution has renewed its license)</SoftTypography>
                                          </Grid> 
                                          <Grid item xs={12} pl={1}>
                                                <Switch name="notify_user_reject" checked={formData.notify_user_reject} onChange={handleChange} />
                                                <SoftTypography variant="button" className="me-1 ms-3">Notify user when account is rejected? </SoftTypography>
                                                <SoftTypography variant="p" className="text-xxs text-secondary fst-italic">(User will receive email notification once their account has been rejected)</SoftTypography>
                                          </Grid> 
                                          <Grid item xs={12} pl={1}>
                                                <Switch name="notify_user_approve" checked={formData.notify_user_approve} onChange={handleChange} />
                                                <SoftTypography variant="button" className="me-1 ms-3">Notify user when account is approved? </SoftTypography>
                                                <SoftTypography variant="p" className="text-xxs text-secondary fst-italic">(User will receive email notification once their account has been approved)</SoftTypography>
                                          </Grid> 
                                          <Grid item xs={12} pl={1} mt={3}>
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
