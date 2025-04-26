// @mui material components
import Grid from "@mui/material/Grid";

// React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
// import Swal from "assets/sweetalert/sweetalert.min.js";

// React examples
import ProfileInfoCard from "essentials/Cards/InfoCards/ProfileInfoCard";
import FixedLoading from "components/General/FixedLoading"; 
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "context/ContextProvider";

function Information({USER, reload}) {
  const currentFileName = "layouts/profile/components/Information/index.js";
  const {access} = useStateContext();  
  const location = useLocation();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(location.state?.from);
  };

  return (
    <>  
      {reload && <FixedLoading /> }
      <SoftBox mt={5} mb={3} px={2}>
        <SoftBox p={4} className="shadow-sm rounded-4 bg-white" >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Personal Information"
                info={{
                  Firstname: USER.first_name,
                  Middle_Name: USER.middle_name,
                  Lastname: USER.last_name,
                  Age: USER.age ?? " ",
                  Gender: USER.gender ?? " ",
                  Birthdate: USER.birthday ?? " ",
                  Email: USER.email ?? " ",
                  Contact_Number: USER.contact ?? " ",
                  Address: USER.address ?? " ",
                  //ADD SOME HERE IF ACCESS IS 5
                  ...(access == 5 && {
                    Grades: USER.grade ?? " ",
                    Section: USER.section ?? " ",
                    Program: USER.program ?? " ",
                    Year_Enrolled: USER.year_enrolled ?? " ",
                  }),
                  Status: USER.account_status == "1" ? "Active" : "Inactive",
                  Last_Online: USER.last_online ?? "None",                  
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <Grid container spacing={2}>
                {(access == 30 || access == 10)  &&
                  <Grid item xs={12}>
                    <ProfileInfoCard
                        title="Campus Information"
                        info={{
                        Campus_Name: USER.client_name ?? " ",
                        Short_Name: USER.client_acr ?? " ",                      
                        }}
                    />
                  </Grid>
                }
                <Grid item xs={12}>
                  <ProfileInfoCard
                      title="Other Information"
                      info={{
                      Updated_Date: USER.updated_date ?? " ",
                      Updated_By: USER.updated_by ?? " ",
                      Created_Date: USER.created_date ?? " ",
                      Created_by: USER.created_by ?? " ",
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
