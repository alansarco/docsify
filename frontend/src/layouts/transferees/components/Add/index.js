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

function Add({HandleRendering, ReloadTable, SECTIONS, PROGRAMS }) {
      const currentFileName = "layouts/transferees/components/Add/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token, clientprovider} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };

      const [fetchclients, setFetchClients] = useState([]);
      const [fetchstudents, setFetchStudents] = useState([]);

      const [showOptions, setShowOptions] = useState(false);
      const [showStudenOptions, setShowStudenOptions] = useState(false);

      const [selectedCampusName, setSelectedCampusName] = useState("");
      const [selectedStudentName, setSelectedStudentName] = useState("");

      useEffect(() => {
            axios.get(apiRoutes.clientSelect)
            .then(response => {
              setFetchClients(response.data.clients);
              passToSuccessLogs(response.data, currentFileName);
            })
            .catch(error => {
              passToErrorLogs(`Clients not Fetched!  ${error}`, currentFileName);
            });
      }, []);

      useEffect(() => {
            axios.get(apiRoutes.studentSelect, {headers})
            .then(response => {
            setFetchStudents(response.data.students);
              passToSuccessLogs(response.data, currentFileName);
            })
            .catch(error => {
              passToErrorLogs(`Students not Fetched!  ${error}`, currentFileName);
            });
      }, []);

      const initialState = {
            username: "",
            clientid: "",
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
            ReloadTable();
            HandleRendering(1);
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
             // Check if all required fields are empty
             const requiredFields = [
                  "username",
                  "clientid",
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
                                    const response = await axios.post(apiRoutes.addTransferee, formData, {headers});
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
                              toast.error("Error transferring student!", { autoClose: true });
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
                                          <Grid item xs={12} md={6} lg={5} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Student: </SoftTypography>
                                                <SoftBox position="relative">
                                                      <input
                                                            type="text"
                                                            className="form-control form-select form-select-sm text-secondary rounded-5"
                                                            value={selectedStudentName}
                                                            onFocus={() => setShowStudenOptions(true)}
                                                            onBlur={() => setTimeout(() => setShowStudenOptions(false), 200)}
                                                            onChange={(e) => {
                                                            setSelectedStudentName(e.target.value);
                                                            setFormData({ ...formData, username: "" });
                                                            }}
                                                      />
                                                      {showStudenOptions && (

                                                      <SoftBox 
                                                            position="absolute" 
                                                            zIndex={10} 
                                                            width="100%" 
                                                            maxHeight="200px" 
                                                            overflow="auto" 
                                                            className="bg-white rounded-5 shadow"
                                                            >
                                                            {fetchstudents
                                                            .filter(school => 
                                                                  school.username !== clientprovider && 
                                                                  school.fullname.toLowerCase().includes(selectedStudentName.toLowerCase())
                                                            )
                                                            .map((school) => (
                                                                  <SoftBox 
                                                                  key={school.username}
                                                                  px={2} 
                                                                  py={1} 
                                                                  className="text-xs cursor-pointer hover:bg-gray-200 py-1"
                                                                  onMouseDown={() => {
                                                                  setFormData({ ...formData, username: school.username });
                                                                  setSelectedStudentName(school.fullname); 
                                                                  setShowStudenOptions(false);
                                                                  }}
                                                                  >
                                                                  {school.fullname}
                                                                  </SoftBox>
                                                            ))}
                                                            {fetchstudents.filter(school => 
                                                            school.fullname.toLowerCase().includes(selectedStudentName.toLowerCase())
                                                            ).length === 0 && (
                                                            <SoftBox px={2} py={1} className="text-xxs text-gray-500">
                                                                  No campus found
                                                            </SoftBox>
                                                            )}
                                                      </SoftBox>
                                                      )}

                                                </SoftBox>
                                          </Grid>
                                          <Grid item xs={12} md={6} lg={4} px={1}>
                                                <SoftTypography variant="button" className="me-1 text-nowrap"> Transfer To: </SoftTypography>
                                                <SoftBox position="relative">
                                                      <input
                                                            type="text"
                                                            className="form-control form-select form-select-sm text-secondary rounded-5"
                                                            value={selectedCampusName}
                                                            onFocus={() => setShowOptions(true)}
                                                            onBlur={() => setTimeout(() => setShowOptions(false), 200)}
                                                            onChange={(e) => {
                                                            setSelectedCampusName(e.target.value);
                                                            setFormData({ ...formData, clientid: "" });
                                                            }}
                                                      />
                                                      {showOptions && (

                                                      <SoftBox 
                                                            position="absolute" 
                                                            zIndex={10} 
                                                            width="100%" 
                                                            maxHeight="200px" 
                                                            overflow="auto" 
                                                            className="bg-white rounded-5 shadow"
                                                            >
                                                            {fetchclients
                                                            .filter(school => 
                                                                  school.clientid !== clientprovider && 
                                                                  school.client_name.toLowerCase().includes(selectedCampusName.toLowerCase())
                                                            )
                                                            .map((school) => (
                                                                  <SoftBox 
                                                                  key={school.clientid}
                                                                  px={2} 
                                                                  py={1} 
                                                                  className="text-xs cursor-pointer hover:bg-gray-200 py-1"
                                                                  onMouseDown={() => {
                                                                  setFormData({ ...formData, clientid: school.clientid });
                                                                  setSelectedCampusName(school.client_name); 
                                                                  setShowOptions(false);
                                                                  }}
                                                                  >
                                                                  {school.client_name}
                                                                  </SoftBox>
                                                            ))}
                                                            {fetchclients.filter(school => 
                                                            school.client_name.toLowerCase().includes(selectedCampusName.toLowerCase())
                                                            ).length === 0 && (
                                                            <SoftBox px={2} py={1} className="text-xxs text-gray-500">
                                                                  No campus found
                                                            </SoftBox>
                                                            )}
                                                      </SoftBox>
                                                      )}

                                                </SoftBox>
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
