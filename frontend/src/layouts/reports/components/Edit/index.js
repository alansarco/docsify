// React components
import { Checkbox, Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { prioritySelect,currentDate  } from "components/General/Utils";
import { reportSelectStatus } from "components/General/Utils";
 
function Edit({DATA, HandleRendering, ReloadTable, handleDelete }) {
    const currentFileName = "layouts/announcements/components/Edit/index.js";
    const [submitProfile, setSubmitProfile] = useState(false);
    const {token, access} = useStateContext();  

    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

    const initialState = {
        id: DATA.id,
        title: DATA.title == null ? "" : DATA.title,
        description: DATA.description == null ? "" : DATA.description,
        location: DATA.location == null ? "" : DATA.location,
        priority_level: DATA.priority_level == null ? "" : DATA.priority_level,
        date_happen: DATA.date_happen == null ? "" : DATA.date_happen,
        time_happen: DATA.time_happen == null ? "" : DATA.time_happen,
        status: DATA.status == null ? "" : DATA.status,
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
                "title",
                "description",
                "location",
                "priority_level",
                "date_happen",
                "time_happen",
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
                                const response = await axios.post(apiRoutes.updateReport, formData, {headers});
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
                                    Report Information    
                            </SoftTypography>
                            <input type="hidden" name="id" value={formData.id} size="small" /> 
                            <Grid container spacing={0} alignItems="center">
                                    <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                        <SoftTypography variant="button" className="me-1">Event Name:</SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <SoftInput name="title" value={formData.title.toUpperCase()} onChange={handleChange} size="small" /> 
                                    </Grid>  
                                    <Grid item xs={12} md={8} lg={5} px={1}>
                                        <SoftTypography variant="button" className="me-1">Location:</SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <SoftInput name="location" value={formData.location} onChange={handleChange} size="small" /> 
                                    </Grid>  
                            </Grid> 
                            <Grid container spacing={0} alignItems="center">
                                    <Grid item xs={12} px={1}>
                                        <SoftTypography variant="button" className="me-1">Description:</SoftTypography>
                                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control text-xs" rows="4"></textarea>
                                    </Grid>  
                                    <Grid item xs={12} sm={6} md={4} px={1}>
                                        <SoftTypography variant="button" className="me-1"> Priority Level: </SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="priority_level" disabled={access != 999} value={formData.priority_level} onChange={handleChange} >
                                            <option value=""></option>
                                            {prioritySelect && prioritySelect.map((priority) => (
                                            <option key={priority.value} value={priority.value}>
                                                {priority.desc}
                                            </option>
                                            ))}
                                        </select>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} px={1}>
                                        <SoftTypography variant="button" className="me-1"> Status: </SoftTypography>
                                        <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                        <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="status" disabled={access != 999} value={formData.status} onChange={handleChange} >
                                            <option value=""></option>
                                            {reportSelectStatus && reportSelectStatus.map((report) => (
                                            <option key={report.value} value={report.value}>
                                                {report.desc}
                                            </option>
                                            ))}
                                        </select>
                                    </Grid>
                            </Grid> 
                            
                            <Grid container spacing={0} alignItems="center">
                                <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                    <SoftTypography variant="button" className="me-1"> Date Happened: </SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <input className="form-control form-control-sm text-secondary rounded-5"  max={currentDate} name="date_happen" value={formData.date_happen} onChange={handleChange} type="date" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={2} px={1}>
                                    <SoftTypography variant="button" className="me-1"> Time Happened: </SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <input className="form-control form-control-sm text-secondary rounded-5" name="time_happen" value={formData.time_happen} onChange={handleChange} type="time" />
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
                                            <SoftButton onClick={() => handleDelete(formData.id)} className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small" color="primary">
                                            delete
                                            </SoftButton>
                                    </SoftBox>
                                </Grid>
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
