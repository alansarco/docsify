import { Checkbox, Grid } from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import * as XLSX from "xlsx";

function UploadStudents({ HandleRendering, ReloadTable }) {
    const currentFileName = "layouts/transferees/components/UploadStudents.js";
    const [submitProfile, setSubmitProfile] = useState(false);
    const { token, access } = useStateContext();  

    const headers = {
        'Authorization': `Bearer ${token}`, // Use the token directly
        'Content-Type': 'multipart/form-data', // Ensure the correct content type
    };
    
    const initialState = {
        data: null, // Use null instead of '' to represent no file
        agreement: false,
    };

    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked }); // Update checkbox state correctly
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // You can keep the original file for upload purposes
                setFormData({ ...formData, data: file }); // Set the actual file instead of jsonData
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleCancel = () => {
        HandleRendering(1);
    };
        
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        toast.dismiss();

        // Check for required fields
        if (!formData.data) {
            toast.warning(messages.required, { autoClose: true });
            return;
        }

        if (!formData.agreement) {
            toast.warning(messages.agreement, { autoClose: true });
            return;
        }

        setSubmitProfile(true);
        try {
            if (!token || access != 30) {
                toast.error(messages.prohibit, { autoClose: true });
                return;
            }
            // Prepare FormData to send
            const formDataToSend = new FormData();
            formDataToSend.append('data', formData.data); // Append the actual file

            // Make the API call
            const response = await axios.post(apiRoutes.uploadExcel, formDataToSend, { headers });
            if (response.data.status === 200) {
                toast.success(response.data.message, { autoClose: true });
                HandleRendering(1);
                ReloadTable(); // Reload the table data
            } else {
                toast.error(response.data.message, { autoClose: true });
            }
            passToSuccessLogs(response.data, currentFileName);
        } catch (error) { 
            toast.error("Error uploading Students!", { autoClose: true });
            passToErrorLogs(error, currentFileName);
        } finally {
            setSubmitProfile(false);
        }
    };

    return (  
        <>
            {submitProfile && <FixedLoading />}   
            <SoftBox mt={5} mb={3} px={2}>      
                <SoftBox mb={5} p={4} className="shadow-sm rounded-4 bg-white">
                    <SoftTypography fontWeight="medium" color="success" textGradient>
                        Direction!
                    </SoftTypography>
                    <SoftTypography fontWeight="bold" className="text-xxs mt-2">
                        REMINDERS:
                    </SoftTypography>
                    <SoftTypography variant="p" className="text-xxs text-secondary span fst-italic">
                        (Please read before filling up the form)
                    </SoftTypography>
                    <ul className="text-danger fw-bold">
                            <li className="text-xxs fst-italic">When USERNAME matches the existing record in database, they will be replaced by new data</li>
                            <li className="text-xxs fst-italic">Existing USERNAME in database that does not matches the new master list will be retain to maintain data integrity</li>
                            <li className="text-xxs fst-italic">Make sure to check the masterlist as uploading will be not successfull once data are not in correct format</li>
                            <li className="text-xxs fst-italic">The default password of student accountwill be their contact number</li>
                    </ul>
                    <SoftBox mt={2}>
                        <SoftBox component="form" role="form" className="px-md-0 px-2" onSubmit={handleSubmit}>
                            <Grid container spacing={0} alignItems="center">
                                <Grid item xs={12} sm={6} md={4} px={1}>
                                    <SoftTypography variant="button" className="me-1">Upload Resident Master List:</SoftTypography>
                                    <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                    <input
                                        type="file"
                                        name="data"
                                        accept=".xlsx, .xls"
                                        onChange={handleFileChange}
                                        className="form-control rounded-pill text-xs"
                                    />
                                </Grid> 
                            </Grid>    
                            
                            <Grid mt={3} container spacing={0} alignItems="center">
                                <Grid item xs={12} pl={1}>
                                    <Checkbox 
                                        className={` ${formData.agreement ? '' : 'border-2 border-success'}`} 
                                        name="agreement" 
                                        checked={formData.agreement} 
                                        onChange={handleChange} 
                                    />
                                    <SoftTypography variant="button" className="me-1 ms-2">Verify Data </SoftTypography>
                                    <SoftTypography variant="p" className="text-xxs text-secondary fst-italic">(Confirming that the information above is true and accurate) </SoftTypography>
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
                                        <SoftButton variant="gradient" type="submit" className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small" color="success">
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

export default UploadStudents;
