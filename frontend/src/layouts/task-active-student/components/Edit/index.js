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
import { getNumber } from "components/General/Utils";
import { requestStatusSelect } from "components/General/Utils";
import TimelineList from "essentials/Timeline/TimelineList";
import TimelineItem from "essentials/Timeline/TimelineItem";
import { getStatusColor } from "components/General/Utils";
import { Autorenew } from '@mui/icons-material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { getStatusIcon } from "components/General/Utils";
import HorizontalTimeline from "components/General/HorizontalTimeline";
function Edit({DATA, HandleRendering, UpdateLoading, ReloadTable, TIMELINE, STATUS }) {
      const currentFileName = "layouts/task-active-student/components/Edit/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };
      
      const initialState = {
            reference_no: DATA.reference_no,
            status_details: "",
            status: DATA.status == null ? "" : DATA.status,
            agreement: false,   
      };

      const [formData, setFormData] = useState(initialState);

      const handleChange = (e) => {
            const { name, value, type, files } = e.target;
    
            if (type === "checkbox") {
                setFormData({ ...formData, [name]: !formData[name] });
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
                  "reference_no",
                  "status_details",
                  "status",
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
                                    
                                    const response = await axios.post(apiRoutes.updateRequestStatus, formData, {headers});
                                    if(response.data.status == 200) {
                                          toast.success(`${response.data.message}`, { autoClose: true });
                                          setFormData((prevState) => ({
                                                ...initialState, // Reset all fields
                                                status: prevState.status, // Keep the existing status
                                            }));
                                        
                                          ReloadTable();
                                          UpdateLoading(true);
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    passToSuccessLogs(response.data, currentFileName);
                              }
                        } catch (error) { 
                              toast.error("Error updating section!", { autoClose: true });
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
                              Request Progress
                        </SoftTypography>
                        
                        <SoftBox mt={2}>
                              <SoftBox component="form" role="form" className="px-md-0 px-2" onSubmit={handleSubmit}>
                                    <HorizontalTimeline STATUS={STATUS} />
                                    <TimelineList shadow="shadow-none" title="Timeline of Requested Document"  >
                                    {(TIMELINE && TIMELINE.length < 0)  ?
                                    <SoftTypography mt={0} color="dark" fontSize="0.8rem" className="text-center">
                                    None for Today!
                                    </SoftTypography> : ""
                                    }
                                    {TIMELINE && TIMELINE.map((time, index) => {
                                    // Get the previous item's status_name
                                    const prevStatusName = index > 0 ? TIMELINE[index - 1].status_name : null;

                                    return (
                                          <TimelineItem
                                                key={index}
                                                color={getStatusColor(time.status)}
                                                icon={getStatusIcon(time.status)}
                                                title={time.status_name === prevStatusName ? "" : time.status_name} // Set empty if same as previous
                                                dateTime={time.created_date}
                                                created={time.created_by}
                                                description={time.status_details}
                                          />
                                    );
                                    })}

                                    </TimelineList>
                                    <Grid mt={3} container spacing={0} alignItems="center" justifyContent="end" className="px-md-4 px-0">
                                          <Grid item xs={12} md={4} lg={2} pl={1}>
                                                <SoftBox mt={2} display="flex" justifyContent="end">
                                                      <SoftButton onClick={handleCancel} className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small" color="light">
                                                            Back
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
