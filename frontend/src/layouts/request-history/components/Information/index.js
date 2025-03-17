// @mui material components
import Grid from "@mui/material/Grid";

// React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
// import Swal from "assets/sweetalert/sweetalert.min.js";

// React examples
import ProfileInfoCard from "essentials/Cards/InfoCards/ProfileInfoCard";
import { getStatus } from "components/General/Utils";
import TimelineList from "essentials/Timeline/TimelineList";
import HorizontalTimeline from "components/General/HorizontalTimeline";
import TimelineItem from "essentials/Timeline/TimelineItem";
import { getStatusColor } from "components/General/Utils";
import { getStatusIcon } from "components/General/Utils";
import SoftTypography from "components/SoftTypography";

function Information({DATA, HandleRendering, ReloadTable, STATUS, TIMELINE}) {

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
                                      description={time.status_details}
                                />
                          );
                          })}

                          </TimelineList>
                    </SoftBox>
              </SoftBox>
            </Grid>
            <Grid item xs={12} xl={4}>
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
          </Grid>   
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default Information;
