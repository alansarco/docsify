import { useState, useEffect } from "react";

// @mui material components
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// @mui icons
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Custom styles for the Configurator
import ConfiguratorRoot from "essentials/Configurator/ConfiguratorRoot";

// React context
import {
  useSoftUIController,
  setOpenConfigurator,  
} from "context";
import { useDashboardData } from "layouts/dashboard/data/dashboardRedux";
import SoftBadge from "components/SoftBadge";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "context/ContextProvider";

function Configurator() {
  const [controller, dispatch] = useSoftUIController();
  const { openConfigurator} = controller;
  const {user, access} = useStateContext();
  
  let {adminnotifs} = useDashboardData({
    // adminnotifs: true, 
  });
  let notifs = 1;
  if(access == 999) {
    notifs = adminnotifs?.adminnotifs;
  }
  else if(access == 30) {
    notifs = adminnotifs?.repnotifs;
  }
  const navigate = useNavigate(); 
  
  const handleViewRequest = () => {
    setOpenConfigurator(dispatch, false); 
    // navigate("/ongoing");  
  };
  
  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false); 
  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={3}
        pb={0.8}
        px={3}  
      >
        <SoftBox>
          <SoftTypography variant="h5">Notifications</SoftTypography>
          <SoftTypography variant="body2" color="text">
            {notifs && notifs.length > 0 ? "Active Request" : "No Active Request"}
          </SoftTypography>
        </SoftBox>

        <Icon
          sx={({ typography: { size, fontWeightBold }, palette: { dark } }) => ({
            fontSize: `${size.md} !important`,
            fontWeight: `${fontWeightBold} !important`,
            stroke: dark.main,
            strokeWidth: "2px",
            cursor: "pointer",
            mt: 2,
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </SoftBox>
      <Divider />
      {notifs && notifs.length > 0 && notifs.map((notif) => (
      <SoftBox key={notif.id} py={2} px={3} className="border-bottom SoftBox cursor-pointer" onClick={handleViewRequest}>
          <SoftBox display="flex">
            <SoftTypography variant="h6">{notif.fullname}</SoftTypography>
            <SoftBadge 
              badgeContent={notif.role === "USER" ? "student" : notif.role} 
              variant="gradient" 
              color={notif.role === "REPRESENTATIVE" ? "dark" 
                  : notif.role === "REGISTRAR" ? "warning"
                  : "info"} 
              size="sm" />
          </SoftBox>
          <SoftBox display="flex">
            <SoftTypography variant="h6" color="secondary" className="text-xxs">{notif.username}</SoftTypography>
            {/* contained */}
          </SoftBox>
          <SoftBox mt={1}>
            {/* <SoftTypography className="text-xxs" color="dark" ><b>Date Added: </b>{adminnotif.created_date}</SoftTypography> */}
            <SoftTypography className="text-xxs" color="dark" >{notif.created_date}</SoftTypography>
          </SoftBox> 
          
        </SoftBox>
       ))}
    </ConfiguratorRoot>
  );
}

export default Configurator;
