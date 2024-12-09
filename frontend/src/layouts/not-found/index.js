// @mui material components
import Card from "@mui/material/Card";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { ToastContainer } from 'react-toastify';

// React examples
import DashboardLayout from "essentials/LayoutContainers/DashboardLayout";
import DashboardNavbar from "essentials/Navbars"; 
import Footer from "essentials/Footer";

// Data
import { Grid } from "@mui/material";

import React, { useEffect, useState } from "react";
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";

function Blank() {
  const {token, access, updateTokenExpiration} = useStateContext();
  updateTokenExpiration();
  if (!token) {
    return <Navigate to="/authentication/sign-in" />
  }
  
  return (
    <> 
      <DashboardLayout>
        <DashboardNavbar/> 
            <SoftBox p={2}>
            <SoftBox >   
              <Card className="px-md-4 px-2 pt-3 pb-md-3 pb-2">
                <Grid container spacing={1} py={1} pb={2}>  
                  <Grid item xs={12} md={8} display="flex">
                    <SoftTypography className="h4 my-auto px-2 text-dark">
                      These page is in under progress.
                    </SoftTypography>
                  </Grid> 
                </Grid>
              </Card>
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

export default Blank;