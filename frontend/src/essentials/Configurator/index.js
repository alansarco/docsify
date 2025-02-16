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
import StudentRoot from "./StudentRoot";
import RegistrarRoot from "./RegistrarRoot";
import RepRoot from "./RepRoot";
import AdminRoot from "./AdminRoot";

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
  else if(access == 10) {
    notifs = adminnotifs?.regnotifs;
  }
  else if(access == 5) {
    notifs = adminnotifs?.studentnotifs;
  }
  const navigate = useNavigate(); 
  
  const handleViewRequest = () => {
    setOpenConfigurator(dispatch, false); 
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
      {access == 999 &&
        <AdminRoot notifs={notifs} handleViewRequest={handleViewRequest} />
      }
      {access == 30 &&
        <RepRoot notifs={notifs} handleViewRequest={handleViewRequest} />
      }
      {access == 10 &&
        <RegistrarRoot notifs={notifs} handleViewRequest={handleViewRequest} />
      }
      {access == 5 &&
        <StudentRoot notifs={notifs} handleViewRequest={handleViewRequest} />
      }
    </ConfiguratorRoot>
  );
}

export default Configurator;
