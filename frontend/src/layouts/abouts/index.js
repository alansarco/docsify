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
import DataContainer from "layouts/settings-admin/components/DataContainer";

import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToErrorLogs } from "components/Api/Gateway";
import { passToSuccessLogs } from "components/Api/Gateway";

function Abouts() {
    const currentFileName = "layouts/abouts/index.js";
    const {token, access, updateTokenExpiration, role} = useStateContext();
    updateTokenExpiration();
    if (!token) {
        return <Navigate to="/authentication/sign-in" />
    }
    else if(token && access < 5) {
        return <Navigate to="/not-found" />
    }
    
    const [fetching, setFetching] = useState("");
    const [searchTriggered, setSearchTriggered] = useState(true);

    const [reload, setReload] = useState(false);

    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

    const [rendering, setRendering] = useState(1);
    const [fetchdata, setFetchdata] = useState([]);


    useEffect(() => {
      if (searchTriggered) {
        setReload(true);
        axios.get(apiRoutes.adminSettings, {headers})
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

  return (
    <> 
      {reload && <FixedLoading />} 
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={rendering} /> 
          <SoftBox p={2}>
            <SoftBox >   
              <SoftBox className="px-md-4 px-3 py-2 d-block d-sm-flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                  <SoftTypography className="text-uppercase text-dark" variant="h6" >About the System</SoftTypography>
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
                              <Grid item xs={12} my={2}>
                                <SoftTypography variant="h4" color="dark">{item.system_name}</SoftTypography>
                              </Grid>
                              <Grid item xs={12} lg={4} mt={2}>
                                <SoftBox display="flex">
                                  <img
                                      src={`data:image/*;base64,${item.logo}`}
                                      alt="profile-image"
                                      width={200}
                                      className="p-2 text-center m-auto shadow"
                                    />
                                </SoftBox>
                                <SoftTypography mt={2} variant="h6" color="dark" className="text-center">Contact</SoftTypography>
                                <SoftTypography variant="h6" className="text-secondary fw-normal text-center">{item.contact}</SoftTypography>
                                <SoftTypography mt={2}variant="h6" color="dark" className="text-center">Email</SoftTypography>
                                <SoftTypography variant="h6" className="text-secondary fw-normal text-center">{item.email}</SoftTypography>
                              </Grid>
                              <Grid item xs={12} lg={7} mt={3}>
                                <SoftTypography variant="h6" color="dark" >System Information</SoftTypography>
                                <SoftTypography variant="h6" className="text-secondary fw-normal justify-text">{item.system_info}</SoftTypography>
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

export default Abouts;