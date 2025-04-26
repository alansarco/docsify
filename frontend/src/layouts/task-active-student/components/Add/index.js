// React components
import { Checkbox, Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { getN, genderSelect, currentDate } from "components/General/Utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { getNumber } from "components/General/Utils";

function Add({HandleRendering, ReloadTable }) {
      const currentFileName = "layouts/admins/components/Add/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token} = useStateContext();  
      const [fetchdocuments, setFetchDocuments] = useState([]);

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };
      useEffect(() => {
            axios.get(apiRoutes.documentSelectStudent, {headers})
            .then(response => {
              setFetchDocuments(response.data.documents);
              passToSuccessLogs(response.data, currentFileName);
            })
            .catch(error => {
              passToErrorLogs(`Documents not Fetched!  ${error}`, currentFileName);
            });
      }, []);
      const initialState = {
            doc_id: "",
            purpose: "",
            agreement: true,   
      };

      const [formData, setFormData] = useState(initialState);

      const handleChange = (e) => {
            const { name, value, type } = e.target;
    
            if (type === "checkbox") {
                setFormData({ ...formData, [name]: !formData[name] });
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
                  "doc_id",
                  "purpose",
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
                                          ReloadTable();
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    passToSuccessLogs(response.data, currentFileName);
                              }
                        } catch (error) { 
                              toast.error("Error adding request!", { autoClose: true });
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
                                          Program Information    
                                    </SoftTypography>
                                    <Grid container spacing={0} alignItems="center">
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1">Documents:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <select className="form-control form-select form-select-sm text-secondary rounded-5 cursor-pointer" name="doc_id" value={formData.doc_id} onChange={handleChange} >
                                                <option value="">-- Select --</option>
                                                      {fetchdocuments && fetchdocuments.map((doc) => (
                                                      <option key={doc.doc_id} value={doc.doc_id}>
                                                            {doc.doc_name}
                                                      </option>
                                                      ))}
                                                </select>
                                          </Grid>
                                          {formData.doc_id != "" &&
                                          <Grid item xs={12} px={1} my={2}>
                                                <SoftTypography variant="button" className="me-1">Document Information:</SoftTypography>
                                                <SoftBox>
                                                      <SoftTypography variant="button" className="me-1 fw-normal" color="info">Yearly Limit:</SoftTypography>
                                                      <SoftTypography variant="span" className="text-xs text-dark fst-italic">
                                                      {fetchdocuments.find(doc => doc.doc_id === formData.doc_id)
                                                      ? `${fetchdocuments.find(doc => doc.doc_id === formData.doc_id).doc_limit} request/s`
                                                      : "No document selected"}
                                                      </SoftTypography>
                                                </SoftBox>
                                                <SoftBox>
                                                      <SoftTypography variant="button" className="me-1 fw-normal" color="info">Processing Time:</SoftTypography>
                                                      <SoftTypography variant="span" className="text-xs text-dark fst-italic">
                                                      {fetchdocuments.find(doc => doc.doc_id === formData.doc_id)
                                                      ? `${fetchdocuments.find(doc => doc.doc_id === formData.doc_id).days_process} day/s`
                                                      : "No document selected"}
                                                      </SoftTypography>
                                                </SoftBox>
                                                <SoftBox>
                                                      <SoftTypography variant="button" className="me-1 fw-normal" color="info">Requirements:</SoftTypography>
                                                      <SoftTypography variant="span" className="text-xs text-dark fst-italic">
                                                            {fetchdocuments.find(doc => doc.doc_id === formData.doc_id)?.doc_requirements || "No document selected"}
                                                      </SoftTypography>
                                                </SoftBox>
                                          </Grid> 
                                          }    
                                             
                                          <Grid item xs={12} px={1}>
                                                <SoftTypography variant="button" className="me-1">Purpose:</SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <textarea name="purpose" value={formData.purpose} onChange={handleChange} className="form-control text-xs" rows="10"></textarea>
                                          </Grid> 
                                    </Grid>    
                                    <Grid mt={3} container spacing={0} alignItems="center">
                                          <Grid item xs={12} pl={1}>
                                                {/* <Checkbox 
                                                      className={` ${formData.agreement ? '' : 'border-2 border-info'}`} 
                                                      name="agreement" 
                                                      checked={formData.agreement} 
                                                      onChange={handleChange} 
                                                /> */}
                                                <SoftTypography variant="button" className="me-1 ms-2">Disclaimer: </SoftTypography>
                                                <SoftTypography variant="p" className="text-xxs text-secondary fst-italic">Confirming that the information above are true and accurate. </SoftTypography>
                                                {/* <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography> */}
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
