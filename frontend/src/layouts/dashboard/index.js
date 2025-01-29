// @mui material components
import Grid from "@mui/material/Grid";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import 'chart.js/auto';
import Icon from "@mui/material/Icon";
// React examples
import DashboardLayout from "essentials/LayoutContainers/DashboardLayout";
import DashboardNavbar from "essentials/Navbars";
import Footer from "essentials/Footer";
import { ToastContainer } from 'react-toastify';
import typography from "assets/theme/base/typography";
// React base styles

// Data
import DefaultDoughnutChart from "essentials/Charts/DoughnutCharts/DefaultDoughnutChart";

import React, { useState } from "react";
import { useDashboardData } from 'layouts/dashboard/data/dashboardRedux';
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import GradientLineChart from "essentials/Charts/LineCharts/GradientLineChart";
import VerticalBarChart from "essentials/Charts/BarCharts/VerticalBarChart";
import TimelineList from "essentials/Timeline/TimelineList";
import { getStatusColor } from "components/General/Utils";
import { getStatusIcon } from "components/General/Utils";
import TimelineDash from "essentials/Timeline/TimelineItem/TimelineDash";
import { getStatus } from "components/General/Utils";

function Dashboard() {
  const {token, access, updateTokenExpiration, clientprovider, clientname} = useStateContext();
  updateTokenExpiration();
  if (!token) {
    return <Navigate to="/authentication/sign-in" />
  }

  const { 
    authUser,
    otherStats , loadOtherStats,
  } = useDashboardData({
    authUser: true, 
    otherStats: true, 
  });  
  const { size } = typography;

  let currentincome = 0;
  let icon = "";
  let iconColor = "";
  let increase = "";
  let percentageChange = 0;
  if (otherStats && otherStats.totalIncome) {
    // Get the current and last year population to compare
    const populationValues = Object.values(otherStats.totalIncome);
    if (populationValues.length >= 2) {
      const lastyearincome = populationValues[populationValues.length - 2]; // Second last year population
      currentincome = populationValues[populationValues.length - 1]
  
      // Calculate percentage change
      percentageChange = (((currentincome - lastyearincome) / Math.abs(lastyearincome)) * 100).toFixed(2);
  
      // Set icon and color based on percentage change
      if (percentageChange > 0) {
        icon = "arrow_upward";
        iconColor = "info";
        increase = "more";
      } else if (percentageChange < 0) {
        icon = "arrow_downward";
        iconColor = "primary";
        increase = "decrease";
      } else {
        percentageChange = 0; // No change
        icon = "arrow_forward"; // Neutral change
        iconColor = "neutral"; // Neutral color
      }
    }
  }

  const year = new Date().getFullYear();
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar RENDERNAV="1" />         
        <SoftBox px={2} py={3}>
          <SoftBox px={2} py={1} mb={2}>
            {authUser != "" && 
              <SoftTypography variant="h4">
                Welcome back, <span className="text-info text-gradient h4">{authUser.first_name}!</span> 
              </SoftTypography>}
              <SoftTypography fontStyle="italic" color="inherit" fontSize="0.9rem">
                DOCSIFY - {clientprovider ? clientname : "Document Request System"}
              </SoftTypography>
              
          </SoftBox>
          <SoftBox mb={3}>
            <Grid container spacing={3}>
            {access == 999 && 
              <>
                <Grid item xs={12} md={7} xl={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} xl={12}>
                      <GradientLineChart
                        title="Current Year Income"
                        currentincome={currentincome}
                        total_income={otherStats.data7}
                        description={
                          <SoftBox display="flex" alignItems="center">
                            <SoftBox fontSize={size.lg} color={iconColor} mb={0.3} mr={0.5} lineHeight={0}>
                              <Icon className="font-bold">{icon}</Icon>
                            </SoftBox>
                            <SoftTypography variant="button" color="text" fontWeight="medium">  
                              {percentageChange}% {increase}{" "}
                              <SoftTypography variant="button" color="text" fontWeight="regular">
                                in {year}
                              </SoftTypography>
                            </SoftTypography>
                          </SoftBox>
                        } 
                        height="20rem"
                        loading={loadOtherStats}
                        chart={{ 
                          labels: [year-10, year-9, year-8, year-7, year-6, year-5, year-4, year-3, year-2, year-1, year],
                          datasets: [
                            {
                              label: "Income",
                              color: "dark",
                                data: otherStats && otherStats.totalIncome && Object.values(otherStats.totalIncome),
                            },
                          ],
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5} xl={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <DefaultDoughnutChart
                        title="Account Distribution"
                        nodata={Object.values(otherStats).every(value => value === "0")}
                        loading={loadOtherStats}
                        chart={{
                          labels: ["Admins", "Reprsentatives", "Registrars", "Students"],  
                          datasets: {
                            label: "Accounts",
                            backgroundColors: ["dark", "primary", "info", "success"],
                            data: [
                              otherStats.data1, 
                              otherStats.data2, 
                              otherStats.data3, 
                              otherStats.data4],
                          },
                        }}
                      />  
                    </Grid>
                    <Grid item xs={12}>
                      <DefaultDoughnutChart
                        title="Campus Distribution"
                        nodata={Object.values(otherStats).every(value => value === "0")}
                        loading={loadOtherStats}
                        chart={{
                          labels: ["Active", "Inactive"],  
                          datasets: {
                            label: "Elections",
                            backgroundColors: ["dark", "warning"],
                            data: [
                              otherStats.data5, 
                              otherStats.data6],
                          },
                        }}
                      />  
                    </Grid>
                  </Grid>
                </Grid>
              </>
            }
            {(access == 30 || access == 10) && 
              <>
                <Grid item xs={12} md={7} xl={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} xl={12}>
                      <VerticalBarChart
                        title="Task Distribution Today"
                        height="20rem"
                        nodata={otherStats && otherStats.taskDistribution && Object.values(otherStats.taskDistribution).every(value => value === "0")}
                        loading={loadOtherStats}
                        maxCount={otherStats && otherStats.taskDistribution && otherStats.taskDistribution.maximum}
                        chart={{
                          labels: ["pending", "in queue", "processing", "releasing", "completed", "rejected"],
                          datasets: [{
                            color: "dark",
                            data: [
                              otherStats && otherStats.taskDistribution && otherStats.taskDistribution.pending, 
                              otherStats && otherStats.taskDistribution && otherStats.taskDistribution.queue, 
                              otherStats && otherStats.taskDistribution && otherStats.taskDistribution.processing, 
                              otherStats && otherStats.taskDistribution && otherStats.taskDistribution.releasing, 
                              otherStats && otherStats.taskDistribution && otherStats.taskDistribution.completed, 
                              otherStats && otherStats.taskDistribution && otherStats.taskDistribution.rejected, 
                            ],
                          }],
                        }}
                      />  
                    </Grid>
                  </Grid>
                </Grid>
                {access == 30 &&
                <Grid item xs={12} md={5} xl={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <DefaultDoughnutChart
                        title="Student Distribution"
                        nodata={otherStats && otherStats.gradeCounts && Object.values(otherStats.gradeCounts).every(value => value === "0")}
                        loading={loadOtherStats}
                        chart={{
                          labels: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Others"],  
                          datasets: {
                            label: "Students",
                            backgroundColors: ["dark", "primary", "info", "success", "warning", "error", "secondary"],
                            data: [
                              otherStats && otherStats.gradeCounts && otherStats.gradeCounts.grade7, 
                              otherStats && otherStats.gradeCounts && otherStats.gradeCounts.grade8, 
                              otherStats && otherStats.gradeCounts && otherStats.gradeCounts.grade9, 
                              otherStats && otherStats.gradeCounts && otherStats.gradeCounts.grade10,
                              otherStats && otherStats.gradeCounts && otherStats.gradeCounts.grade11,
                              otherStats && otherStats.gradeCounts && otherStats.gradeCounts.grade12,
                              otherStats && otherStats.gradeCounts && otherStats.gradeCounts.others,
                            ],
                          },
                        }}
                      />  
                    </Grid>
                    <Grid item xs={12}>
                      <DefaultDoughnutChart
                        title="Registrar Distribution"
                        nodata={otherStats && otherStats.registrarCounts && Object.values(otherStats.registrarCounts).every(value => value === "0")}
                        loading={loadOtherStats}
                        chart={{
                          labels: ["Active", "Inactive"],  
                          datasets: {
                            label: "Registrar",
                            backgroundColors: ["dark", "warning"],
                            data: [
                              otherStats && otherStats.registrarCounts && otherStats.registrarCounts.active, 
                              otherStats && otherStats.registrarCounts && otherStats.registrarCounts.inactive
                            ],
                          },
                        }}
                      />  
                    </Grid>
                  </Grid>
                </Grid>
                }
                {access == 10 &&
                <Grid item xs={12} md={5} xl={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TimelineList title="My Tasks">
                        {(otherStats && otherStats.mytask && otherStats.mytask.length < 0)  ?
                        <SoftTypography mt={0} color="dark" fontSize="0.8rem" className="text-center">
                        None for Today!
                        </SoftTypography> : ""
                        }
                        {otherStats && otherStats.mytask && otherStats.mytask.length && otherStats.mytask.map((time, index) => {
                        // Get the previous item's status_name
                        return (
                              <TimelineDash
                                    key={index}
                                    color={getStatusColor(time.status)}
                                    icon="lens"
                                    title={time.doc_name} // Set empty if same as previous
                                    dateNeeded={time.date_needed}
                                    dateRequested={time.date_added}
                                    description={time.fullname}
                                    badges={[
                                      getStatus(time.status)
                                    ]}
                              />
                        );
                        })}
                      </TimelineList>
                    </Grid>
                  </Grid>
                </Grid>
                }
                
              </>
            }
            </Grid>
          </SoftBox>
        </SoftBox>
        <Footer />
      </DashboardLayout>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        limit={5}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        theme="light"
      />
    </>
    
  );
}

export default Dashboard;
