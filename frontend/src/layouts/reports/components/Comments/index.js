// React components
import { Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import { useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
 
function Comments({COMMENTS, DATA, HandleRendering, ReloadTable }) {
    const currentFileName = "layouts/announcements/components/Comments/index.js";
    const [submitProfile, setSubmitProfile] = useState(false);
    const {token} = useStateContext();  
    const [commentlist, setCommentList] = useState(COMMENTS);

    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

    const initialState = {
        id: DATA,
        comment: "",
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

    const handleSubmitComment = async (e) => {
        e.preventDefault(); 
        toast.dismiss();
        // Check if all required fields are empty
        const requiredFields = [
                "comment",
        ];
        const emptyRequiredFields = requiredFields.filter(field => !formData[field]);
        if (emptyRequiredFields.length === 0) {
            setSubmitProfile(true);
            try {
                    if (!token) {
                        toast.error(messages.prohibit, { autoClose: true });
                    }
                    else {  
                        const response = await axios.post(apiRoutes.submitComment, formData, {headers});
                        if(response.data.status == 200) {
                            setCommentList(response.data.comments);
                            setFormData(initialState);
                        } else {
                            toast.error(`${response.data.message}`, { autoClose: true });
                        }
                        passToSuccessLogs(response.data, currentFileName);
                    }
            } catch (error) { 
                toast.error("Cannot submit comment!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
            }     
            setSubmitProfile(false);
                
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
                        Be sensitive as system does not support yet on editing comments.
                </SoftTypography> 
                <SoftBox mt={2}>
                    <SoftBox component="form" role="form" className="px-md-0 px-2" onSubmit={handleSubmitComment}>
                        <SoftTypography fontWeight="medium" textTransform="capitalize" color="info" textGradient>
                                COMMENTS    
                        </SoftTypography>
                        <input type="hidden" name="id" value={formData.id} size="small" /> 
                        <Grid container spacing={0} alignItems="center">
                            <Grid item xs={12} px={1}>
                                {commentlist && commentlist.map((comments) => (
                                    <SoftBox key={comments.id}>
                                        <SoftTypography variant="button" className="text-xs">
                                            {comments.name}
                                        </SoftTypography>
                                        <SoftTypography variant="h1" className="text-xxs fw-normal">
                                            {comments.comment_date}
                                        </SoftTypography>
                                        <SoftTypography variant="h1" color="white" className="my-1 p-2 px-3 text-xs border bg-secondary text-normal fst-italic rounded">{comments.comment}</SoftTypography>
                                    </SoftBox>
                                ))}
                                
                            </Grid>                                      
                        </Grid> 
                        <Grid container spacing={0} mt={2} alignItems="center">
                            <Grid item xs={12} px={1}>
                                <SoftTypography variant="button" className="me-1">Your comment here:</SoftTypography>
                                <textarea name="comment" value={formData.comment} onChange={handleChange} className="form-control text-xs" rows="4"></textarea>
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
                                            submit
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

export default Comments;
