import { useState, useEffect } from "react";

// react-router components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// React components
import SoftBox from "components/SoftBox";

// React examples
import Breadcrumbs from "essentials/Breadcrumbs";
import AccountItems from "essentials/Items/AccountItems";
import { Grid } from "@mui/material";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarMobileMenu,
} from "essentials/Navbars/styles";

// React context
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import SoftTypography from "components/SoftTypography";

import { useStateContext } from "context/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { toast } from 'react-toastify';
import FixedLoading from "components/General/FixedLoading";
import { useDashboardData } from "layouts/dashboard/data/dashboardRedux";
import NotificationsIcon from '@mui/icons-material/Notifications';

function DashboardNavbar(props) {
  const absolute = props.absolute;
  const light = props.light;
  const isMini = props.isMini;
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const {token, user, access, setToken, setUser, setRole, setAccess} = useStateContext();
  const [submitLogout, setSubmitLogout] = useState(false);

  
  if (token == "expired") {
    toast.error("Token expired please login again!", { autoClose: true });
  }
  const render = props.RENDERNAV;

  const {authUser, polls} = useDashboardData({
    authUser: true, 
    polls: true, 
    render: render
  });
  // const notifs = polls.filter(poll => poll.status !== "archive").length;
  let notifs = polls.length;

  useEffect(() => {
    const updateTimestamps = () => {
      const now = new Date();

      // Format date
      const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('en-US', dateOptions).replace(',', ' -');
      setFormattedDate(formattedDate);

      // Format time
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
      setFormattedTime(formattedTime);  
    };

    // Initial update
    updateTimestamps();

    // Set interval to update every 500 milliseconds
    const intervalId = setInterval(updateTimestamps, 500);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("sticky");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };
  const handlePassword = () => {
    navigate("/change-password", { state: { from: location } });
  }

  const handleLogout = async (e) => {
    setSubmitLogout(true);
    handleCloseMenu();
    try {
      const response = await axios.get(apiRoutes.doLogout, {headers})
      .then(() => {
        setUser(null);
        setToken(null);
        setRole(null);
        setAccess(null);
        toast.success(`${response.data.message}`, { autoClose: true });
      })
      .catch(error => {
        setUser(null);
        setToken(null);
        toast.error(`Error! ${error}`, { autoClose: true });
      });
    } 
    catch (error) {
      toast.error(`Can't Logout! ${error}`, { autoClose: true });
    }
    setSubmitLogout(false);
  };

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <AccountItems
        color="secondary"
        description="Change Password?"
        image={
          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
            account_circle
          </Icon>
        }
        title={[authUser.name, ""]}
        onClick={handlePassword}

      />
      <AccountItems
        color="secondary"
        description="Take a break?"
        image={
          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
            logout
          </Icon>
        }
        title={["Logout", ""]}
        onClick={handleLogout}
      />
    </Menu>
  );

  return (
    <>  
    {submitLogout && <FixedLoading />}
    <AppBar className="top-0 position-sticky"
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })} 
    >
      <Grid container py={1} px={2}>
        <Grid item xs={6} sm={6} color="inherit">
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </Grid>
          <Grid item xs={6} sm={6}>  
              <SoftBox display="flex" justifyContent="end" color="inheret">         
                <SoftBox px={2}>  
                  <SoftTypography textGradient color="info" className="d-md-block d-none" textAlign="end" variant="h5">{formattedTime}</SoftTypography>
                  <SoftTypography className="d-md-block d-none" fontSize="0.8rem">{formattedDate}</SoftTypography>
                </SoftBox>  
                {access >= 5 && 
                <>
                  <IconButton 
                  size="large"
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Icon >
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>
                </>
              }
              {access == 999 && 
                <>
                <IconButton
                  size="medium"
                  color="inherit"
                  onClick={handleConfiguratorOpen}  
                >
                  <NotificationsIcon />
                  {notifs > 0 && <SoftTypography className="fw-bold bg-danger text-white rounded-circle notif"> {notifs} </SoftTypography>}
                </IconButton>
                </>
              }
              
              <IconButton
                size="medium"
                color="inherit"
                onClick={handleOpenMenu}
              >
                <Icon>account_circle</Icon>
              </IconButton>
              {renderMenu()}
            </SoftBox>
          </Grid>
      </Grid>
    </AppBar>
    </>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
