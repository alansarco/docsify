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

import React, { useState } from "react";
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";

function NotFound() {
      const currentFileName = "layouts/blank/index.js";
      const {token, access, updateTokenExpiration} = useStateContext();
      updateTokenExpiration();
      if (!token) {
            return <Navigate to="/authentication/sign-in" />
      }
      const [rendering, setRendering] = useState(1);

      return (
      <> 
            <DashboardLayout>
            <DashboardNavbar RENDERNAV={rendering} /> 
                  <SoftBox p={2} height="80vh" className="d-flex">
                        <SoftBox className="m-auto">   
                              <SoftTypography variant="h1" className="my-auto px-2 text-center text-primary text-gradient">
                              404
                              </SoftTypography> 
                              <SoftTypography className="h4 my-auto fw-bold px-2 text-dark text-center">
                              Not Found!
                              </SoftTypography>
                              <SoftTypography className="text-xs my-auto px-2 text-dark text-center">
                              Hmmm... You're not supposed to be here.
                              </SoftTypography>
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

export default NotFound;