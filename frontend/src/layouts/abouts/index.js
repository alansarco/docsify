// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import 'chart.js/auto';

// React examples
import DashboardLayout from "essentials/LayoutContainers/DashboardLayout";
import DashboardNavbar from "essentials/Navbars";
import Footer from "essentials/Footer";
import { ToastContainer, toast } from 'react-toastify';
import FixedLoading from "components/General/FixedLoading";
import { passToSuccessLogs, passToErrorLogs } from "components/Api/Gateway";

import React, { useState, useEffect } from "react";
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";

function Abouts() {
  const currentFileName = "layouts/announcements/index.js";
  const { token, access, role, updateTokenExpiration } = useStateContext();
  updateTokenExpiration();

  if (!token) {
    return <Navigate to="/authentication/sign-in" />;
  }

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const [reload, setReload] = useState(true);
  const [edit, setEdit] = useState(false);
  const [fetchdata, setFetchdata] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState(true);

  const reloadTable = () => {
    axios.get(apiRoutes.retrieveSettings, { headers })
      .then(response => {
        setFetchdata(response.data.settings);
        passToSuccessLogs(response.data, currentFileName);
        setReload(false);
        setSuccess(true);
      })
      .catch(error => {
        passToErrorLogs(`Abouts not Fetched!  ${error}`, currentFileName);
        setSuccess(false);
        setReload(false);
      });
  };

  useEffect(() => {
    if (reload && success) {
      setReload(true);
      setSuccess(true);
      reloadTable();
    }
  }, [reload]);

  useEffect(() => {
    if (fetchdata && fetchdata.length > 0) {
      // Set initial image preview
      const initialImage = `data:image/png;base64,${fetchdata[0].org_structure}`;
      setImagePreview(initialImage);
    }
  }, [fetchdata]);

  return (
    <>
      {reload && <FixedLoading />}
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={edit} />
        <SoftBox p={2}>
          <SoftBox className="px-md-4 px-3 py-2" display="flex" justifyContent="space-between" alignItems="center">
            <SoftBox>
              <SoftTypography className="text-uppercase text-secondary" variant="h6">About the System</SoftTypography>
            </SoftBox>
          </SoftBox>
          <Card className="bg-white rounded-5">
            <SoftBox mt={2} p={2} pb={4}>
              <SoftBox className="px-md-4 px-2">
                {fetchdata && fetchdata.length > 0 && 
                <SoftTypography fontWeight="medium" textTransform="capitalize" color="info" textGradient>
                  System Information
                </SoftTypography>
                }
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={12} px={1}>
                    <SoftTypography color="secondary" className="text-sm paragraph_format">
                    {fetchdata[0]?.system_info || ""}
                    </SoftTypography>
                  </Grid>  
                  <Grid item xs={12} px={1} mt={2}>
                    <SoftTypography color="dark" className="text-sm paragraph_format">
                       <b>{fetchdata[0]?.system_id && "Contact:"}</b> {fetchdata[0]?.contact || ""}
                    </SoftTypography>
                    <SoftTypography color="dark" className="text-sm paragraph_format">
                      <b>{fetchdata[0]?.system_id && "Email:"}</b> {fetchdata[0]?.email || ""}
                    </SoftTypography>
                  </Grid>  
                </Grid>
                <Grid container spacing={0} alignItems="center" px={1} mt={3}>
                  <Grid item xs={12} justifyContent="center">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Organization Structure Preview"
                        className="text-xxs"
                        style={{ width: "100%", marginTop: "10px", borderRadius: "5px" }}
                      />
                    )}
                  </Grid>
                </Grid>
              </SoftBox>
            </SoftBox>
          </Card>
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

