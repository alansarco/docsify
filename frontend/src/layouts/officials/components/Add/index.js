// React components
import { Checkbox, Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { colorSelect, currentDate } from "components/General/Utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";

function Add({HandleRendering, ReloadTable}) {
      const currentFileName = "layouts/admins/components/Add/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };
        
      const initialState = {
            name: "",
            position: "",
            id_picture: null,
            biography: "",
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
                if (file && (file.type === "application/png" || file.name.endsWith(".png"))) {
                    setFormData({ ...formData, id_picture: file });
                } else {
                    toast.error("Only .png images are allowed");
                    e.target.value = null;
                }
            } 
            else {
                  setFormData({ ...formData, [name]: value });
            }
      };

      const handleCancel = () => {
            HandleRendering(1);
            ReloadTable();
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
            // Check if all required fields are empty
            const requiredFields = [
                  "name",
                  "position",
                  "id_picture",
                  "biography",
            ];
            const emptyRequiredFields = requiredFields.filter(field => !formData[field]);

            // Check if event_date_end is less than event_date
            const eventDate = new Date(formData.event_date);
            const eventDateEnd = new Date(formData.event_date_end);

            if (emptyRequiredFields.length === 0) {
                  if(!formData.agreement) {
                        toast.warning(messages.agreement, { autoClose: true });
                  }
                  else if (eventDateEnd < eventDate) {
                        toast.warning("End date cannot be before the start date!", { autoClose: true });
                  }
                  else {      
                        setSubmitProfile(true);
                        try {
                              if (!token) {
                                    toast.error(messages.prohibit, { autoClose: true });
                              }
                              else {  
                                    const data = new FormData();
                                    data.append("name", formData.name);
                                    data.append("position", formData.position);
                                    data.append("id_picture", formData.id_picture);
                                    data.append("biography", formData.biography);
                                    const response = await axios.post(apiRoutes.addOfficial, data, {headers});
                                    if(response.data.status == 200) {
                                          toast.success(`${response.data.message}`, { autoClose: true });
                                          setFormData(initialState);
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    passToSuccessLogs(response.data, currentFileName);
                              }
                        } catch (error) { 
                              toast.error(messages.addUserError, { autoClose: true });
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
                                          Official Information    
                                    </SoftTypography>
                                    <Grid container spacing={0} alignItems="center">
                                          <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">Name:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="name" value={formData.name.toUpperCase()} onChange={handleChange} size="small" /> 
                                          </Grid>  
                                          <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">Position:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <SoftInput name="position" value={formData.position} onChange={handleChange} size="small" /> 
                                          </Grid>  
                                          <Grid item xs={12} md={8} lg={6}px={1}>
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
                                          <Grid item xs={12} px={1}>
                                                <SoftTypography variant="button" className="me-1">Short Biography:</SoftTypography>
                                                <textarea name="biography" value={formData.biography} onChange={handleChange} className="form-control text-xs" rows="4"></textarea>
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
