import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// React icons
import Settings from "essentials/Icons/Settings";

// React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import logo from "assets/images/logo.png";
import bgImage from "assets/images/brgy.jpg";
import Security from "../Security";
import { useStateContext } from "context/ContextProvider";
import { useDashboardData } from "layouts/dashboard/data/dashboardRedux";

function ProfileContainer() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  const {authUser, polls} = useDashboardData({
    authUser: true, 
    polls: false, 
  });


  const setSettings = () => {
    setTabValue(0);
  };

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.xsm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const {token, role, access} = useStateContext();
  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const UpdateLoading = (reloading) => {
    setReload(reloading);
  };

  return (
    <>
    <SoftBox position="relative" mt={3}>
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.3),
              rgba(gradients.info.state, 0.2)
            )}, url(${bgImage})`, 
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SoftAvatar
              src={logo}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                {authUser.name}{" "}
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {authUser.username}{" "}
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={3} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: "transparent" }}
              >
                <Tab label="Security" onClick={setSettings} icon={<Settings />} />
              </Tabs> 
            </AppBar>
          </Grid>
        </Grid>
      </Card>
    </SoftBox>
    <Security USER={authUser} />
    </>
  );
}

export default ProfileContainer;
