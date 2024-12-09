// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import 'chart.js/auto';
// React examples
import DashboardLayout from "essentials/LayoutContainers/DashboardLayout";
import DashboardNavbar from "essentials/Navbars";
import Footer from "essentials/Footer";
import { ToastContainer, toast } from 'react-toastify';

// React base styles
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import Icon from "@mui/material/Icon";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
// Data
import TimelineList from "essentials/Timeline/TimelineList";
import Add from "layouts/reports/components/Add";
import Edit from "layouts/reports/components/Edit";
import Comments from "layouts/reports/components/Comments";
import FixedLoading from "components/General/FixedLoading";
import { passToSuccessLogs, passToErrorLogs } from "components/Api/Gateway";

import React, { useState, useEffect } from "react";
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";

import TimelineReport from "essentials/Timeline/TimelineReport";
import { useDashboardData } from "layouts/dashboard/data/dashboardRedux";

function Reports() {
  const currentFileName = "layouts/announcements/index.js";
  const {token, access, role, updateTokenExpiration} = useStateContext();
  updateTokenExpiration();
  if (!token) {
    return <Navigate to="/authentication/sign-in" />
  }

  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const {authUser} = useDashboardData({
    authUser: true, 
    otherStats: false, 
    polls: false
  }, []);

  const [DATA, setRetrieveOne] = useState(); 
  const [COMMENTS, setComments] = useState(); 
  const [reload, setReload] = useState(false);
  const [rendering, setRendering] = useState(1);
  const [fetchdata, setFetchdata] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(true);
  const [list, setList] = useState(true);
  const [DataID, setDataID] = useState();


  const HandleRendering = (rendering) => {
    setRendering(rendering);
  };

  const handleUpdate = (id) => {
    setReload(true);
    axios.get(apiRoutes.retrieveReportOne, { params: { id }, headers })
      .then(response => {
        if (response.data.status === 200) {
          setRendering(2);
          setRetrieveOne(response.data.report);  
        } else {
          toast.error(`${response.data.message}`, { autoClose: true });
        }
        passToSuccessLogs(response.data, currentFileName);
        setReload(false);
      })  
      .catch(error => {
        passToErrorLogs(`Event not Fetched!  ${error}`, currentFileName);
        setReload(false);
      });
  };

  const handleComment = (id) => {
    setReload(true);
    axios.get(apiRoutes.retrieveReportOne, { params: { id }, headers })
      .then(response => {
        if (response.data.status === 200) {
          setDataID(id);
          setRendering(4);
          setComments(response.data.comments);  
        } else {
          toast.error(`${response.data.message}`, { autoClose: true });
        }
        passToSuccessLogs(response.data, currentFileName);
        setReload(false);
      })  
      .catch(error => {
        passToErrorLogs(`Event not Fetched!  ${error}`, currentFileName);
        setReload(false);
      });
  };

  const ReloadTable = () => {
    axios.get(apiRoutes.retrieveReport, {headers} )
    .then(response => {
      setFetchdata(response.data.reports);
      passToSuccessLogs(response.data, currentFileName);
      setReload(false);
    })
    .catch(error => {
      passToErrorLogs(`Reports not Fetched!  ${error}`, currentFileName);
      setReload(false);
    });
  }

  useEffect(() => {
    if (searchTriggered) {
      setReload(true);
      axios.get(apiRoutes.retrieveReport, {headers} )
        .then(response => {
          setFetchdata(response.data.reports);
          passToSuccessLogs(response.data, currentFileName);
          setReload(false);
        })
        .catch(error => {
          passToErrorLogs(`Reports not Fetched!  ${error}`, currentFileName);
          setReload(false);
        });
        setSearchTriggered(false);
    }
  }, [searchTriggered]);

  const handleDelete = async (id) => {
    Swal.fire({
      customClass: {
        title: 'alert-title',
        icon: 'alert-icon',
        confirmButton: 'alert-confirmButton',
        cancelButton: 'alert-cancelButton',
        container: 'alert-container',
        popup: 'alert-popup'
      },
      title: 'Delete Report?',
      text: "Are you sure you want to delete this? This action cannot be reverted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I confirm!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSearchTriggered(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.deleteReport, { params: { id }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                  setRendering(1);
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                setSearchTriggered(true);
              })  
              .catch(error => {
                setSearchTriggered(true);
                toast.error("Cant delete report!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };

  const handleReopen = async (id) => {
    Swal.fire({
      customClass: {
        title: 'alert-title',
        icon: 'alert-icon',
        confirmButton: 'alert-confirmButton',
        cancelButton: 'alert-cancelButton',
        container: 'alert-container',
        popup: 'alert-popup'
      },
      title: 'Re-open Report /Case?',
      text: "Are you sure you want to re-open this report?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I confirm!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSearchTriggered(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.reopenReport, { params: { id }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                setSearchTriggered(true);
              })  
              .catch(error => {
                setSearchTriggered(true);
                toast.error("Cant delete report!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };

  return (
    <>
      {reload && <FixedLoading /> }
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={rendering} />      
        {DATA && rendering == 2 ? 
            <Edit handleDelete={handleDelete} DATA={DATA} HandleRendering={HandleRendering} ReloadTable={ReloadTable} />       
          :
          rendering == 3 ?
            <Add HandleRendering={HandleRendering} ReloadTable={ReloadTable}  />
        :   
          rendering == 4 ?
            <Comments COMMENTS={COMMENTS} DATA={DataID} HandleRendering={HandleRendering} ReloadTable={ReloadTable} />
        :   
        <SoftBox p={2}>
            <SoftBox className="px-md-4 px-3 py-2" display="flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                    <SoftTypography className="text-uppercase text-secondary" variant="h6" >Report List</SoftTypography>
                </SoftBox>
                <SoftBox display="flex">
                    <SoftButton onClick={() => setList(!list)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color={list ? "warning" : "secondary"} size="small" >
                      {list ? 
                        <> <VisibilityTwoToneIcon className="me-1"/> View Resolved</>
                         :
                        <> <VisibilityTwoToneIcon className="me-1"/> View Pending</>
                      }
                    </SoftButton>
                    <SoftButton onClick={() => setRendering(3)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color="info" size="small" >
                      <Icon>add</Icon> Add Report
                    </SoftButton>
                </SoftBox>
            </SoftBox>
            <Card className="bg-white rounded-5">
              <SoftBox mb={3} p={2} >
                  <Grid container spacing={3}>
                      <Grid item xs={12} >
                        <TimelineList shadow="shadow-none" className="bg-success" title="Please be guided with barangay reports and change the status once resolved."  >
                            {((fetchdata && fetchdata.pendingreports && fetchdata.resolvedreports) 
                            && !fetchdata.resolvedreports.length > 0 && !fetchdata.pendingreports.length > 0 ) ?
                            <SoftTypography mt={0} color="dark" fontSize="0.8rem" className="text-center">
                                None for Today!
                            </SoftTypography> : ""
                            }
                            {((list && fetchdata && fetchdata.pendingreports) && fetchdata.pendingreports.length > 0) ?
                            <SoftTypography mt={0} fontWeight="bold" color="info" pl={2} textGradient fontSize="1rem">
                                Pending
                            </SoftTypography> : ""
                            }
                            {list && fetchdata && fetchdata.pendingreports && 
                            fetchdata.pendingreports.map((report) => (
                            (access == 999 || report.created_by == authUser.username) &&
                            <React.Fragment key={report.id}> {/* Correctly using fragment with a key */}
                              <TimelineReport
                                color="info"
                                icon="payment"
                                reported={report.reported_by}
                                contact={report.contact}
                                location={report.location}
                                priority={report.priority}
                                title={report.title}
                                dateTime={report.report_datetime} 
                                dateHappen={report.date_happen} 
                                timeHappen={report.time_happen} 
                                description={report.description}
                              />
                                <SoftBox mt={2} display="flex" justifyContent="end">
                                  {(access == 999 || report.created_by == authUser.username) &&
                                  <>
                                    <SoftButton onClick={() => handleComment(report.id)} className="text-xxs py-0 me-2 px-3 rounded-pill" size="small" variant="gradient" color="info">
                                      <BorderColorTwoToneIcon className="me-1" /> comment 
                                    </SoftButton>
                                    <SoftButton onClick={() => handleUpdate(report.id)} className="text-xxs py-0 me-2 px-3 rounded-pill" size="small" variant="gradient" color="dark">
                                      <VisibilityTwoToneIcon className="me-1" /> see more 
                                    </SoftButton>
                                  </>
                                  }                       
                                </SoftBox>
                              </React.Fragment>
                            )
                            )}
                            
                            {((!list && fetchdata && fetchdata.resolvedreports) && fetchdata.resolvedreports.length > 0) ? 
                              <SoftTypography mt={0} fontWeight="bold" color="info" pl={2} textGradient fontSize="1rem">
                                  Resolved
                              </SoftTypography> : ""
                              }
                            {!list && fetchdata && fetchdata.resolvedreports && 
                            fetchdata.resolvedreports.map((report) => (
                            (access == 999 || report.created_by == authUser.username) &&
                            <React.Fragment key={report.id}> {/* Correctly using fragment with a key */}
                              <TimelineReport
                                color="secondary"
                                icon="payment"
                                reported={report.reported_by}
                                contact={report.contact}
                                location={report.location}
                                priority={report.priority}
                                title={report.title}
                                dateTime={report.report_datetime} 
                                dateHappen={report.date_happen} 
                                timeHappen={report.time_happen} 
                                description={report.description}
                              />        
                              {access == 999 && role === "ADMIN" &&
                                <SoftBox mt={2} display="flex" justifyContent="end">
                                  <SoftButton onClick={() => handleReopen(report.id)} className="text-xxs py-0 me-2 px-3 rounded-pill" size="small" variant="gradient" color="info">
                                    <CheckCircleTwoToneIcon /> Re-open
                                  </SoftButton>
                                </SoftBox>
                              }                      
                            </React.Fragment>
                            )
                            )}
                        </TimelineList>
                      </Grid>
                  </Grid>
              </SoftBox>
            </Card>
            
            
        </SoftBox>
        }
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

export default Reports;
