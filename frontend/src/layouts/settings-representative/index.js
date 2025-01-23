// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { ToastContainer } from 'react-toastify';

// React examples
import DashboardLayout from "essentials/LayoutContainers/DashboardLayout";
import DashboardNavbar from "essentials/Navbars"; 
import Footer from "essentials/Footer";

// Data
import { Grid } from "@mui/material";

import React, { useEffect, useState } from "react";
import FixedLoading from "components/General/FixedLoading"; 
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import DataContainer from "layouts/settings-representative/components/DataContainer";

import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToErrorLogs } from "components/Api/Gateway";
import { passToSuccessLogs } from "components/Api/Gateway";
import { formatCurrency } from "components/General/Utils";

function RepresentativeSettings() {
    const currentFileName = "layouts/settings-representative/index.js";
    const {token, access, updateTokenExpiration, role} = useStateContext();
    updateTokenExpiration();
    if (!token) {
        return <Navigate to="/authentication/sign-in" />
    }
    else if(token && access < 10) {
        return <Navigate to="/not-found" />
    }
    
    const [fetching, setFetching] = useState("");
    const [searchTriggered, setSearchTriggered] = useState(true);

    const [reload, setReload] = useState(false);

    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

    const [DATA, setDATA] = useState(); 
    const [rendering, setRendering] = useState(1);
    const [fetchdata, setFetchdata] = useState([]);
    

    const HandleDATA = () => {
      setReload(true);
      axios.get(apiRoutes.representativeSettingsRetrieved, {headers})
        .then(response => {
          setReload(false);
          if(response.data.status == 200) {
            setDATA(response.data.settings);
            setRendering(2);
          }
          else {
            setFetching("No data Found!");
          }
          passToSuccessLogs(response.data, currentFileName);
        })
        .catch(error => {
          passToErrorLogs(`Settings did not Retrieved!  ${error}`, currentFileName);
          setReload(false);
        });
      setSearchTriggered(false);
    };

    const HandleRendering = (rendering) => {
        setRendering(rendering);
    };

    useEffect(() => {
      if (searchTriggered) {
        setReload(true);
        axios.get(apiRoutes.representativeSettings, {headers})
          .then(response => {
            setReload(false);
            if(response.data.status == 200) {
              setFetchdata(response.data.settings);
            }
            else {
              setFetchdata([]);
              setFetching("No data Found!");
            }
            passToSuccessLogs(response.data, currentFileName);
          })
          .catch(error => {
            passToErrorLogs(`Settings did not Fetched!  ${error}`, currentFileName);
            setReload(false);
          });
        setSearchTriggered(false);
      }
    }, [searchTriggered]);

    const ReloadTable = () => {
      axios.get(apiRoutes.representativeSettings, {headers})
        .then(response => {
        setFetchdata(response.data.settings);
        passToSuccessLogs(response.data, currentFileName);
        })
        .catch(error => {
        console.error('Error fetching data for the next page:', error);
        });
    }

  return (
    <> 
      {reload && <FixedLoading />} 
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={rendering} /> 
          {DATA && rendering == 2 ? 
            <DataContainer DATA={DATA} HandleRendering={HandleRendering} ReloadTable={ReloadTable} />       
          :
          <SoftBox p={2}>
            <SoftBox >   
              <SoftBox className="px-md-4 px-3 py-2 d-block d-sm-flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                  <SoftTypography className="text-uppercase text-dark" variant="h6" >Settings</SoftTypography>
                </SoftBox>
                <SoftBox display="flex" >
                  <SoftButton onClick={() => HandleDATA(2)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color="dark" size="small" >
                    Update Settings
                  </SoftButton>
                </SoftBox>
              </SoftBox>
              <Grid container className="px-md-4 px-2 pt-3 pb-md-3 pb-2">
                <Grid item xs={12} className="p-4 rounded-5 bg-white shadow" width="100%">
                  <SoftBox className="mx-2 table-container" minHeight={500}>
                    {fetchdata && fetchdata.data && fetchdata.data.length > 0 ? 
                      <>
                      <SoftBox className="d-flex" height="100%">
                        {fetchdata.data.map((item, index) => (
                          <SoftBox key={index} className="p-2 m-2">
                            <Grid container>
                              <Grid item xs={12} md={6} lg={4} mt={2}>
                                <SoftTypography variant="h6" color="dark" >Logo</SoftTypography>
                                <SoftBox display="flex">
                                  <img
                                      src={`data:image/*;base64,${item.client_logo}`}
                                      alt="profile-image"
                                      width={200}
                                      className="p-2 text-center m-auto shadow"
                                    />
                                </SoftBox>
                              </Grid>
                              <Grid item xs={12} md={6} lg={8} mt={2}>
                                <SoftTypography variant="h6" color="dark" >Banner</SoftTypography>
                                <SoftBox display="flex">
                                  <img
                                      src={`data:image/*;base64,${item.client_banner}`}
                                      alt="profile-image"
                                      width="100%"
                                      height={400}
                                      className="p-2 text-center m-auto shadow"
                                    />
                                </SoftBox>
                              </Grid>
                              <Grid item xs={12} md={6} mt={5}>
                                <Grid container>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Name: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.client_name || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Short Name: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.client_acr || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Email: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.client_email}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Contact: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.client_contact || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Address: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.client_address || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Current Payment: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{formatCurrency(item.current_payment)}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Total Payment: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{formatCurrency(item.total_payment)}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Request Limit per Day: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.request_limit || "N/A"}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Request Cutoff: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.request_timeout || "N/A"}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Reprsentative ID: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.representative_id || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Representative Name: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.representative_name || " "}</SoftTypography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} md={6} mt={5}>
                                <Grid container>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Total Registrar: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.registrarCount || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Total Student: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.studentCount || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Total License Used: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.licenseCount || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Subscription Start: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.format_subscription_start || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Subscription End: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.format_subscription_end || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Date Created: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.created_date || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Date Updated: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.updated_date || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Created By: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.created_by || " "}</SoftTypography>
                                  </Grid>
                                  <Grid item xs={12} mt={1} display="flex">
                                    <SoftTypography variant="h6" color="dark" >Updated By: </SoftTypography>
                                    <SoftTypography variant="h6" className="text-secondary fw-normal ms-2">{item.updated_by || " "}</SoftTypography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </SoftBox>
                        ))}
                      </SoftBox>
                      </> 
                      :
                      <>
                      <SoftBox className="d-flex" minHeight={500} height="500">
                        <SoftTypography variant="h6" className="m-auto text-secondary">   
                        {fetchdata && fetchdata.data && fetchdata.data.length < 1 ? "No data Found" : fetching}                    
                        </SoftTypography>
                      </SoftBox>
                      </>
                    }
                  </SoftBox>
                </Grid>
              </Grid>
            </SoftBox>
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

export default RepresentativeSettings;