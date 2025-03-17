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

import React, { useEffect, useState } from "react";
import { useStateContext } from "context/ContextProvider";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToSuccessLogs } from "components/Api/Gateway";
import { passToErrorLogs } from "components/Api/Gateway";
import axios from "axios";
import StudentAnalyticsChart from "essentials/Charts/LineCharts/GradientLineChart/StudentAnalyticsChart";
import { Switch } from "@mui/material";

function Analytics() {
    const currentFileName = "layouts/analytics/index.js";
    const {token, access, updateTokenExpiration, clientprovider, clientname} = useStateContext();
    updateTokenExpiration();
    if (!token) {
        return <Navigate to="/authentication/sign-in" />
    }
    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

    const [reloadstudent, setReloadStudent] = useState(true);
    const [searchTriggered, setSearchTriggered] = useState(true);
    const [fetchstudent, setFetchStudent] = useState([]);
    const [fetching, setFetching] = useState("");
    const [showstudents, setShowStudents] = useState(true);
    const [showregistrars, setShowRegistrars] = useState(true);
    const [showrequests, setShowRequests] = useState(true);

    const [reloadgrades, setReloadGrades] = useState(true);
    const [fetchgrades, setFetchGrades] = useState([]);

    const initialState = {
        doc_id: "",
        created_at: "",
        filter: "",
        assigned: "",
        status: "", 
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (searchTriggered) {
            setReloadStudent(true);
          axios.post(apiRoutes.StudentAnalyticsChart, formData, {headers})
            .then(response => {
                setReloadStudent(false);
                setFetchStudent(response.data.studentanalyticschart);
                passToSuccessLogs(response.data, currentFileName);
                setFetching("No data Found!")
            })
            .catch(error => {
                passToErrorLogs(`Student Analytics not Fetched!  ${error}`, currentFileName);
                setReloadStudent(false);
            });
          setSearchTriggered(false);
        }
    }, [searchTriggered]);
    

    useEffect(() => {
        if (searchTriggered) {
            setReloadGrades(true);
            axios.get(apiRoutes.gradeCounts, {headers})
            .then(response => {
                setReloadGrades(false);
                setFetchGrades(response.data.gradecounts);
                passToSuccessLogs(response.data, currentFileName);
                setFetching("No data Found!")
            })
            .catch(error => {
                passToErrorLogs(`Grade Analytics not Fetched!  ${error}`, currentFileName);
                setReloadGrades(false);
            });
          setSearchTriggered(false);
        }
    }, [searchTriggered]);

    const { size } = typography;

    let icon = "";
    let iconColor = "";
    let increase = "";
    if (fetchstudent && fetchstudent.totalusers) {
        // Get the current and last year population to compare
        const totalusersValues = Object.values(fetchstudent.totalusers);
        if (totalusersValues.length >= 2) {
            // Set icon and color based on percentage change
        if (fetchstudent.percentageChange > 0) {
            icon = "arrow_upward";
            iconColor = "info";
            increase = "more";
        } else if (fetchstudent.percentageChange < 0) {
            icon = "arrow_downward";
            iconColor = "primary";
            increase = "decrease";
        } else {
            fetchstudent.percentageChange = 0; // No change
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
                <SoftBox mb={3}>
                    <SoftBox pb={2}>
                    <SoftTypography variant="h6" textGradient color="primary" className="mb-2 text-uppercase fw-bold">Data Analytics Chart </SoftTypography>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={3} lg={2} display="flex" alignItems="center">
                            <Switch checked={showstudents} onClick={() => setShowStudents(!showstudents)} />
                            <SoftTypography variant="button" className="me-1 ms-3 text-nowrap">Student Chart </SoftTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2} display="flex" alignItems="center">
                            <Switch checked={showregistrars} onClick={() => setShowRegistrars(!showregistrars)} />
                            <SoftTypography variant="button" className="me-1 ms-3 text-nowrap">Registrar Chart </SoftTypography>
                        </Grid>
                        <Grid item xs={12} md={3} lg={2} display="flex" alignItems="center">
                            <Switch checked={showrequests} onClick={() => setShowRequests(!showrequests)} />
                            <SoftTypography variant="button" className="me-1 ms-3 text-nowrap">Request Chart </SoftTypography>
                        </Grid>
                    </Grid>
                </SoftBox>
                {showstudents &&
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7} xl={8}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} xl={12}>
                        <StudentAnalyticsChart
                            title="Student Analytics Chart"
                            totaldata={fetchstudent.totaluserscount}
                            description={
                                fetchstudent.percentageChange &&
                            <SoftBox display="flex" alignItems="center">
                                <SoftBox fontSize={size.lg} color={iconColor} mb={0.3} mr={0.5} lineHeight={0}>
                                <Icon className="font-bold">{icon}</Icon>
                                </SoftBox>
                                <SoftTypography variant="button" color="text" fontWeight="medium">  
                                {fetchstudent.percentageChange}% {increase}{" "}
                                </SoftTypography>
                            </SoftBox>
                            } 
                            height="20rem"
                            loading={reloadstudent}
                            chart={{ 
                            labels: [year-10, year-9, year-8, year-7, year-6, year-5, year-4, year-3, year-2, year-1, year],
                            datasets: [
                                {
                                  label: "All Students",
                                  color: "violet",
                                    data: fetchstudent?.totalusers && Object.values(fetchstudent.totalusers),
                                },
                                // ["secondary", "primary", "info", "success", "warning", "error", "secondary"],

                                {
                                label: "Grade 7",
                                color: "dark",
                                    data: fetchstudent?.totalusersGR7 && Object.values(fetchstudent.totalusersGR7),
                                },
                                {
                                label: "Grade 8",
                                color: "primary",
                                    data: fetchstudent?.totalusersGR8 && Object.values(fetchstudent.totalusersGR8),
                                },
                                {
                                label: "Grade 9",
                                color: "info",
                                    data: fetchstudent?.totalusersGR9 && Object.values(fetchstudent.totalusersGR9),
                                },
                                {
                                label: "Grade 10",
                                color: "success",
                                    data: fetchstudent?.totalusersGR10 && Object.values(fetchstudent.totalusersGR10),
                                },
                                {
                                label: "Grade 11",
                                color: "warning",
                                    data: fetchstudent?.totalusersGR11 && Object.values(fetchstudent.totalusersGR11),
                                },
                                {
                                label: "Grade 12",
                                color: "error",
                                    data: fetchstudent?.totalusersGR12 && Object.values(fetchstudent.totalusersGR12),
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
                            title="Student Distribution"
                            nodata={fetchgrades?.gradecounts && Object.values(fetchgrades.gradecounts).every(value => value === "0")}
                            loading={reloadgrades}
                            chart={{
                            labels: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Others"],  
                            datasets: {
                                label: "Students",
                                backgroundColors: ["dark", "primary", "info", "success", "warning", "error", "secondary"],
                                data: [
                                    fetchgrades?.gradecounts?.grade7 ?? 0, 
                                    fetchgrades?.gradecounts?.grade8 ?? 0, 
                                    fetchgrades?.gradecounts?.grade9 ?? 0, 
                                    fetchgrades?.gradecounts?.grade10 ?? 0,
                                    fetchgrades?.gradecounts?.grade11 ?? 0,
                                    fetchgrades?.gradecounts?.grade12 ??0,
                                    fetchgrades?.gradecounts?.others ?? 0,
                                ],
                            },
                            }}
                        />  
                        </Grid>
                    </Grid>
                    </Grid>
                </Grid>
                }
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

export default Analytics;
