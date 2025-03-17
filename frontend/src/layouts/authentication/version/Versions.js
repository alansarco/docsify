import { useEffect, useState } from "react";

// @mui material components
import Checkbox from "@mui/material/Checkbox";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import logo from "assets/images/logo.jpg";

// react-router-dom components
import { Link, Navigate  } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useSignInData } from "../sign-in/data/signinRedux";
import MainLoading from "components/General/MainLoading";
import { useStateContext } from "context/ContextProvider";
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import { versions } from "./version-data";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Versions() {
  const {token} = useStateContext(); 

  if (token) {
    return <Navigate to="/dashboard" />
  }
  
  const { isLoading, status} = useSignInData();

  return (
    <>
    {status == 1 && !isLoading ? 
    <>
        <SoftBox className="bg-white" height="100vh">
            <SoftTypography px={2} py={2} variant="h6" mb={1} color="white" className="bg-dark">
                <SoftTypography mb={0} component={Link} to="/authentication/sign-in"  className="text-white">
                    <ArrowBackIosIcon />
                </SoftTypography>
                Software Versions
            </SoftTypography>
            {versions.map((version, index) => (
            <SoftBox key={index} px={2} pb={3}>
                <SoftTypography variant="h6" mb={1} className="text-uppercase">{version.version}</SoftTypography>
                {version.details.map((detail, i) => (
                    <SoftBox display="flex" alignItems="center">
                        {detail.types === "bug"  && <SoftTypography ml={3} className="text-md text-danger"><BuildIcon /></SoftTypography>}
                        {detail.types === "new"  && <SoftTypography ml={3} className="text-md text-success"><AddIcon /></SoftTypography>}
                        {detail.types === "update"  && <SoftTypography ml={3} className="text-md text-warning"><CodeOffIcon /></SoftTypography>}
                        <SoftTypography ml={2} className="text-xxs">{detail.description}</SoftTypography>
                    </SoftBox>
                ))}
            </SoftBox>
            ))}
        </SoftBox>
    </> : <MainLoading />
    }
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

export default Versions;
