// React components
import { Checkbox, Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { colorSelect, currentDate } from "components/General/Utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Card from "@mui/material/Card";

function Add({HandleRendering, ReloadTable}) {
      const currentFileName = "layouts/admins/components/Add/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const [reload, setReload] = useState(true);
      const {token} = useStateContext();  
      const [fetchdocs, setFetchdocs] = useState([]);
      const [events, setEvents] = useState([]);

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };

      useEffect(() => {
            if (reload) {
                  axios.get(apiRoutes.availabledateRequest, {headers} )
                  .then(response => {
                        setEvents(response.data.calendars.events);
                        passToSuccessLogs(response.data, currentFileName);
                        setReload(false);
                  })
                  .catch(error => {
                        passToErrorLogs(`Requests not Fetched!  ${error}`, currentFileName);
                        setReload(false);
                  });
                  setReload(false);
            }
      }, [reload]);

      const formattedEvents = events.map(event => ({
            title: event.title,
            start: new Date(event.start), // JavaScript will correctly parse the ISO string
            end: new Date(event.end),
            color: event.color,
      }));

      const eventStyleGetter = (event) => {
            const backgroundColor = event.color;
            const style = {
              backgroundColor,
              borderRadius: '5px',
              opacity: 0.8,
              color: 'white',
              border: '0px',
              fontSize: '15px',
              display: 'block'
            };
            return {
              style: style
            };
      };  
      const localizer = momentLocalizer(moment);

      useEffect(() => {
            axios.get(apiRoutes.docSelect, { headers })
            .then(response => {
                setFetchdocs(response.data.documents);
                passToSuccessLogs(response.data.documents, currentFileName);
            })
            .catch(error => {
            passToErrorLogs(`Documents not Fetched!  ${error}`, currentFileName);
            });
      }, []);
      
        
      const initialState = {
            type: "",
            purpose: "",
            date_needed: "",
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
            ReloadTable();
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
            // Check if all required fields are empty
            const requiredFields = [
                  "type",
                  "purpose",
                  "date_needed",
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
                                    const response = await axios.post(apiRoutes.addRequest, formData, {headers});
                                    if(response.data.status == 200) {
                                          toast.success(`${response.data.message}`, { autoClose: true });
                                          setFormData(initialState);
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    setReload(true);
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
            <SoftTypography pl={2} variant="button" fontWeight="medium" color="dark">
                  We limit 20 REQUESTS per day to ensure that documents will be processed accordingly. Use the calendar below as your guide.
            </SoftTypography>
            <Grid container spacing={0} alignItems="top" mt={3}>
                  <Grid item xs={12} md={7} px={1}>
                        <Card className="bg-white rounded-5 mb-3">
                              <SoftBox className="p-4">
                                    <Calendar
                                          localizer={localizer}
                                          events={formattedEvents}
                                          startAccessor="start"
                                          endAccessor="end"
                                          style={{ height: 500 }}
                                          eventPropGetter={eventStyleGetter} // Apply custom styles
                                    />
                                    </SoftBox>
                        </Card>
                  </Grid>
                  <Grid item xs={12} md={5} px={1}>
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
                                                Request Information    
                                          </SoftTypography>
                                          <Grid container spacing={0} alignItems="center">
                                                <Grid item xs={12} px={1}>
                                                      <SoftTypography variant="button" className="me-1 text-nowrap"> Document: </SoftTypography>
                                                      <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                      <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="type" value={formData.type} onChange={handleChange} >
                                                      <option value="">-- Select Document --</option>
                                                      {fetchdocs && fetchdocs.map((docs, index) => (
                                                      <option key={index} value={docs.doc_name}>
                                                            {docs.doc_name}
                                                      </option>
                                                      ))}
                                                      </select>
                                                </Grid>
                                                <Grid item xs={12} px={1}>
                                                      <SoftTypography variant="button" className="me-1">Purpose:</SoftTypography>
                                                      <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                      <SoftInput name="purpose" value={formData.purpose} onChange={handleChange} size="small" /> 
                                                </Grid>  
                                          </Grid> 
                                          <Grid container spacing={0} alignItems="center">
                                                <Grid item xs={12} px={1}>
                                                      <SoftTypography variant="button" className="me-1"> Date Needed: </SoftTypography>
                                                      <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                      <input className="form-control form-control-sm text-secondary rounded-5"  min={currentDate} name="date_needed" value={formData.date_needed} onChange={handleChange} type="date" />
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
                                                <Grid item xs={12} sm={4} pl={1}>
                                                      <SoftBox mt={2} display="flex" justifyContent="end">
                                                            <SoftButton onClick={handleCancel} className="mx-1 w-100 text-xxs px-3 rounded-pill" size="small" color="light">
                                                                  Back
                                                            </SoftButton>
                                                      </SoftBox>
                                                </Grid>
                                                <Grid item xs={12} sm={4} pl={1}>
                                                      <SoftBox mt={2} display="flex" justifyContent="end">
                                                            <SoftButton variant="gradient" type="submit" className="mx-1 w-100 text-xxs px-3 rounded-pill" size="small" color="info">
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
      );
}

export default Add;
