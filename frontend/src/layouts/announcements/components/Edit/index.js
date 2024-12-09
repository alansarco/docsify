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
 
function Edit({DATA, HandleRendering, ReloadTable }) {
    const currentFileName = "layouts/announcements/components/Edit/index.js";
    const [submitProfile, setSubmitProfile] = useState(false);
    const {token} = useStateContext();  
    const [reload, setReload] = useState(true);

    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

    const initialState = {
        id: DATA.id,
        event_name: DATA.event_name == null ? "" : DATA.event_name,
        description: DATA.description == null ? "" : DATA.description,
        details: DATA.details == null ? "" : DATA.details,
        event_date: DATA.event_date == null ? "" : DATA.event_date,
        event_date_end: DATA.event_date_end == null ? "" : DATA.event_date_end,
        time: DATA.time == null ? "" : DATA.time,
        time_end: DATA.time_end == null ? "" : DATA.time_end,
        hashtag1: DATA.hashtag1 == null ? "" : DATA.hashtag1,
        hashtag2: DATA.hashtag2 == null ? "" : DATA.hashtag2,
        hashtag3: DATA.hashtag3 == null ? "" : DATA.hashtag3,
        color: DATA.color == null ? "" : DATA.color,
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
                "event_name",
                "description",
                "event_date",
                "event_date_end",
                "time",
                "time_end",
                "hashtag1",
                "hashtag2",
                "hashtag3",
                "color",
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
                                const response = await axios.post(apiRoutes.updateAnnouncement, formData, {headers});
                                if(response.data.status == 200) {
                                        toast.success(`${response.data.message}`, { autoClose: true });
                                } else {
                                        toast.error(`${response.data.message}`, { autoClose: true });
                                }
                                passToSuccessLogs(response.data, currentFileName);
                            }
                    } catch (error) { 
                            toast.error("Cannot update Event!", { autoClose: true });
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
                                    Announcement Information    
                            </SoftTypography>
                            <input type="hidden" name="id" value={formData.id} size="small" /> 
                            <Grid container spacing={0} alignItems="center">
                                    <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                        <SoftTypography variant="button" className="me-1">Event Name:</SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <SoftInput name="event_name" value={formData.event_name.toUpperCase()} onChange={handleChange} size="small" /> 
                                    </Grid>  
                                    <Grid item xs={12} md={8} lg={5} px={1}>
                                        <SoftTypography variant="button" className="me-1">Description:</SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <SoftInput name="description" value={formData.description} onChange={handleChange} size="small" /> 
                                    </Grid>  
                            </Grid> 
                            <SoftTypography mt={2} fontWeight="medium" textTransform="capitalize" color="info" textGradient>
                                    Other Information    
                            </SoftTypography>
                            <Grid container spacing={0} alignItems="center">
                                    <Grid item xs={12} px={1}>
                                        <SoftTypography variant="button" className="me-1">Details:</SoftTypography>
                                        <textarea name="details" value={formData.details} onChange={handleChange} className="form-control text-xs" rows="4"></textarea>
                                    </Grid>  
                                    <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                        <SoftTypography variant="button" className="me-1"> Event Date Start: </SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <input className="form-control form-control-sm text-secondary rounded-5"  min={currentDate} name="event_date" value={formData.event_date} onChange={handleChange} type="date" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={2} px={1}>
                                        <SoftTypography variant="button" className="me-1"> Event Time Start: </SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <input className="form-control form-control-sm text-secondary rounded-5" name="time" value={formData.time} onChange={handleChange} type="time" />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6} md={4} lg={2} px={1}>
                                        <SoftTypography variant="button" className="me-1"> Color: </SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="color" value={formData.color} onChange={handleChange} >
                                                <option value=""></option>
                                                {colorSelect && colorSelect.map((color) => (
                                                <option key={color.value} value={color.value}>
                                                    {color.desc}
                                                </option>
                                                ))}
                                        </select>
                                    </Grid>
                            </Grid> 
                            <Grid container spacing={0} alignItems="center">
                                <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                    <SoftTypography variant="button" className="me-1"> Event Date End: </SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <input className="form-control form-control-sm text-secondary rounded-5"  min={currentDate} name="event_date_end" value={formData.event_date_end} onChange={handleChange} type="date" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={2} px={1}>
                                    <SoftTypography variant="button" className="me-1"> Event End Time: </SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <input className="form-control form-control-sm text-secondary rounded-5" name="time_end" value={formData.time_end} onChange={handleChange} type="time" />
                                </Grid> 
                            </Grid> 
                            <Grid container spacing={0} alignItems="center">
                                    <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                        <SoftTypography variant="button" className="me-1"> Hashtags: </SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <input placeholder="#hashtag1" className="form-control form-control-sm text-secondary rounded-5" name="hashtag1" value={formData.hashtag1} onChange={handleChange} />
                                        <input placeholder="#hashtag2" className="form-control form-control-sm text-secondary rounded-5 mt-2" name="hashtag2" value={formData.hashtag2} onChange={handleChange} />
                                        <input placeholder="#hashtag3" className="form-control form-control-sm text-secondary rounded-5 mt-2" name="hashtag3" value={formData.hashtag3} onChange={handleChange} />
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
