// @mui material components
import Grid from "@mui/material/Grid";

// React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import { toast } from "react-toastify";
// import Swal from "assets/sweetalert/sweetalert.min.js";

// React examples
import ProfileInfoCard from "essentials/Cards/InfoCards/ProfileInfoCard";
import { useStateContext } from "context/ContextProvider";
import { passToSuccessLogs, passToErrorLogs } from "components/Api/Gateway";
import { apiRoutes } from "components/Api/ApiRoutes";
import { useState } from "react";
import FixedLoading from "components/General/FixedLoading"; 
import { messages } from "components/General/Messages";
import axios from "axios";  
import { getStatus } from "components/General/Utils";
import TimelineList from "essentials/Timeline/TimelineList";
import HorizontalTimeline from "components/General/HorizontalTimeline";
import TimelineItem from "essentials/Timeline/TimelineItem";
import { getStatusColor } from "components/General/Utils";
import { getStatusIcon } from "components/General/Utils";
import SoftTypography from "components/SoftTypography";

function Information({DATA, HandleRendering, ReloadTable, STATUS, TIMELINE}) {
  const [deleteUser, setDeleteUser] = useState(false);
  const currentFileName = "layouts/users/components/UserContainer/index.js";

  const reference_no = DATA.reference_no;
  const {token, role, access} = useStateContext();  
  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const handleCancel = () => {
    HandleRendering(1);
    ReloadTable();
  };

  const handleDelete = async (e) => {
    e.preventDefault();     
    Swal.fire({
      customClass: {
        title: 'alert-title',
        icon: 'alert-icon',
        confirmButton: 'alert-confirmButton',
        cancelButton: 'alert-cancelButton',
        container: 'alert-container',
        popup: 'alert-popup'
      },
      title: 'Cancel request?',
      text: "Are you sure you want to cancel your request? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I confirm it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeleteUser(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.cancelRequest, { params: { reference_no }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                HandleRendering(1);
                ReloadTable();
                setDeleteUser(false);
              })  
              .catch(error => {
                setDeleteUser(false);
                toast.error("Cant assign request!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };


  return (
    <>  
      {deleteUser && <FixedLoading /> }
      <SoftBox mt={5} mb={3} px={2}>
        <SoftBox p={4} className="shadow-sm rounded-4 bg-white" >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SoftTypography fontWeight="medium" color="info" textGradient>
                Request Progress
              </SoftTypography>
              <SoftBox mt={2}>
                    <SoftBox component="form" role="form" className="px-md-0 px-2" >
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
                    </SoftBox>
              </SoftBox>
            </Grid>
            <Grid item xs={12}>
              <ProfileInfoCard
                title="Request Information"
                info={{
                  Reference_No: DATA.reference_no ?? " ",
                  Documet: DATA.doc_name ?? " ",
                  Contact: DATA.contact ?? " ",
                  Purpose: DATA.purpose ?? " ",
                  Status: getStatus(DATA.status) ?? " ",
                  Assigned_Registrar: DATA.task_owner == null ? "None" : DATA.task_owner_name,
                  Target_Finish: DATA.date_needed ?? " ",
                  Created_Date: DATA.created_date ?? " ",
                  Created_By: DATA.fullname ?? " ",
                  Updated_Date: DATA.updated_date ?? " ",
                  Updated_By: DATA.updated_by ?? " ",
                }}
              />
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
            {DATA.status < 2 &&
            <Grid item xs={12} sm={4} md={2} pl={1}>
              <SoftBox mt={2} display="flex" justifyContent="end">
                <SoftButton onClick={handleDelete} variant="gradient" color="info" className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small">
                  Cancel Request
                </SoftButton>
              </SoftBox>
            </Grid>
            }
          </Grid>   
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default Information;
