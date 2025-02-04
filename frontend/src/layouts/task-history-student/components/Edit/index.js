// React components
import { Grid} from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import TimelineList from "essentials/Timeline/TimelineList";
import TimelineItem from "essentials/Timeline/TimelineItem";
import { getStatusColor } from "components/General/Utils";
import { getStatusIcon } from "components/General/Utils";
import HorizontalTimeline from "components/General/HorizontalTimeline";
function Edit({HandleRendering, ReloadTable, TIMELINE, STATUS }) {

      const handleCancel = () => {
            HandleRendering(1);
            ReloadTable();
      };
            
      return (  
      <>
            <SoftBox mt={5} mb={3} px={2}>      
                  <SoftBox mb={5} p={4} className="shadow-sm rounded-4 bg-white">
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
                  </SoftBox>
            </SoftBox>
      </>
      );
}

export default Edit;
