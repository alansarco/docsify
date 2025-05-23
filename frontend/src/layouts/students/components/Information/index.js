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
import SoftTypography from "components/SoftTypography";

function Information({USER, HandleRendering, ReloadTable}) {
  const [deleteUser, setDeleteUser] = useState(false);
  const currentFileName = "layouts/students/components/Information/index.js";
  const [openModal, setOpenModal] = useState(false);
  const username = USER.username;
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
      title: 'Reject Student?',
      text: "Are you sure you want to reject this account? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Ask for reject message after confirm
        const { value: reject_message } = await Swal.fire({
          customClass: {
            title: 'alert-title',
            icon: 'alert-icon',
            confirmButton: 'alert-confirmButton',
            cancelButton: 'alert-cancelButton',
            container: 'alert-container',
            popup: 'alert-popup'
          },
          title: 'Reason for Deletion',
          input: 'text',
          icon: 'warning',
          inputPlaceholder: 'Enter a reason...',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to enter a reason!';
            }
          }
        });
  
        if (reject_message) {
          setDeleteUser(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          } else {
            axios.get(apiRoutes.deleteStudent, {
              params: { username, reject_message },
              headers
            })
              .then(response => {
                if (response.data.status === 200) {
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
                toast.error("Can't reject student", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
        }
      }
    });
  };
  


  return (
    <>  
      {deleteUser && <FixedLoading /> }
      <SoftBox mt={5} mb={3} px={2}>
        {openModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}
            onClick={() => setOpenModal(false)}
          >
            <img
              src={`data:image/*;base64,${USER.requirement}`}
              alt="enlarged"
              style={{ maxHeight: '90vh', maxWidth: '90vw' }}
            />
          </div>
        )}
        <SoftBox p={4} className="shadow-sm rounded-4 bg-white" >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Personal Information"
                info={{
                  Firstname: USER.first_name,
                  Middle_Name: USER.middle_name,
                  Lastname: USER.last_name,
                  Grades: USER.grade ?? " ",
                  Section: USER.section_name ?? " ",
                  Program_Name: USER.program_name ?? " ",
                  Program_Acronym: USER.program_acr ?? " ",
                  Year_Enrolled: USER.year_enrolled ?? " ",
                  Age: USER.age ?? " ",
                  Gender: USER.gender ?? " ",
                  Birthdate: USER.birthday ?? " ",
                  Email: USER.email ?? " ",
                  Contact_Number: USER.contact ?? " ",
                  Address: USER.address ?? " ",
                  Status: USER.account_status == "1" ? "Active" : "Inactive",
                  Last_Online: USER.last_online ?? "None",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ProfileInfoCard
                      title="Campus Information"
                      info={{
                      Campus_Name: USER.client_name ?? " ",
                      Short_Name: USER.client_acr ?? " ",                      
                      }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ProfileInfoCard
                      title="Other Information"
                      info={{
                      Updated_Date: USER.created_date ?? " ",
                      Updated_By: USER.updated_by ?? " ",
                      Created_Date: USER.created_date ?? " ",
                      Created_by: USER.created_by ?? " ",
                      }}
                  />
                </Grid>
                {USER.requirement &&
                <Grid item xs={12}>
                  <SoftTypography textGradient color="info" className="text-center text-sm fw-bold">SCHOOL ID</SoftTypography>
                    <SoftBox display="flex">
                      <img
                          src={`data:image/*;base64,${USER.requirement}`}
                          alt="profile-image"
                          width={200}
                          className="p-2 text-center my-auto shadow cursor-pointer"
                          onClick={() => setOpenModal(true)}
                        />
                    </SoftBox>
                </Grid>
                }
              </Grid>
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
            {access == 30 && USER.new_account == 1 &&
            <Grid item xs={12} sm={4} md={2} pl={1}>
              <SoftBox mt={2} display="flex" justifyContent="end">
                <SoftButton onClick={handleDelete} variant="gradient" color="primary" className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small">
                  Reject
                </SoftButton>
              </SoftBox>
            </Grid>}
          </Grid>   
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default Information;
