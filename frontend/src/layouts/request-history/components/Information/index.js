// @mui material components
import Grid from "@mui/material/Grid";

// React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
// import Swal from "assets/sweetalert/sweetalert.min.js";

// React examples
import ProfileInfoCard from "essentials/Cards/InfoCards/ProfileInfoCard";
import { getStatus } from "components/General/Utils";

function Information({DATA, HandleRendering, ReloadTable}) {

  const handleCancel = () => {
    HandleRendering(1);
    ReloadTable();
  };

  return (
    <>  
      <SoftBox mt={5} mb={3} px={2}>
        <SoftBox p={4} className="shadow-sm rounded-4 bg-white" >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ProfileInfoCard
                title="Request Information"
                info={{
                  Reference_No: DATA.reference_no ?? " ",
                  Documet: DATA.doc_name ?? " ",
                  Status: getStatus(DATA.status) ?? " ",
                  Assigned_Registrar: DATA.task_owner == null ? "None" : DATA.task_owner_name,
                  Date_Needed: DATA.date_needed ?? " ",
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
          </Grid>   
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default Information;
