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
import { formatCurrency } from "components/General/Utils";

function Information({DATA, LICENSE, HandleRendering, ReloadTable}) {
  const [deleteUser, setDeleteUser] = useState(false);
  const currentFileName = "layouts/campuses/components/Information/index.js";
  const clientid = DATA.clientid;
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
      title: 'Delete Campus?',
      text: "Are you sure you want to delete this? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeleteUser(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.deleteCampus, { params: { clientid }, headers })
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
                toast.error("Cant delete Campus", { autoClose: true });
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
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Campus Information"
                info={{
                  Name: DATA.client_name,
                  Acronym: DATA.client_acr ?? " ",
                  Current_License: DATA.license_key ?? " ",
                  Current_Payment: formatCurrency(DATA.current_payment) ?? " ",
                  Total_Payment: formatCurrency(DATA.total_payment) ?? " ",
                  Subscription_Start: DATA.format_subscription_start ?? " ",
                  Subscription_End: DATA.format_subscription_end ?? " ",
                  Email: DATA.client_email ?? " ",
                  Contact_Number: DATA.client_contact ?? " ",
                  Address: DATA.client_address ?? " ",
                  Total_Student: DATA.studentCount ?? " ",
                  Total_Registrar: DATA.registrarCount ?? " ",
                  School_Admin_Representative: DATA.representative_name ?? " ",
                  School_Admin_Representative_ID: DATA.client_representative ?? " ",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <Grid container spacing={2}>
                {LICENSE && LICENSE.length > 0 &&
                  <Grid item xs={12}>
                      <ProfileInfoCard
                          title="License History"
                          info={{
                              ...LICENSE.reduce((acc, license, index) => {
                                acc[`${index + 1}`] = 
                                (license.license_key ?? "") + " | " +
                                (license.date_use ?? "") + " | " +
                                (formatCurrency(license.license_price) ?? "");
                              return acc;
                      
                              }, {})
                          }}
                      />
                  </Grid>
                  }
                <Grid item xs={12}>
                  <ProfileInfoCard
                      title="Other Information"
                      info={{
                      Updated_Date: DATA.updated_date ?? " ",
                      Updated_By: DATA.updated_by ?? " ",
                      Created_Date: DATA.created_date ?? " ",
                      Created_by: DATA.created_by ?? " ",
                      }}
                  />
                </Grid>
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
          </Grid>   
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default Information;
