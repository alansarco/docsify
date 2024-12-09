// @mui material components
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, miniSidenav } = ownerState;

  const sidebarWidth = 255;
  const { white, transparent, background } = palette;
  const { xxl } = boxShadows;
  const { pxToRem } = functions;

  // styles for the sidenav when miniSidenav={false}
  const drawerOpenStyles = () => ({
    transform: `translateX(${pxToRem(-320)})`,
    transform: "translateX(0)",
    // transition: transitions.create("transform", {
    //   easing: transitions.easing.sharp,
    //   duration: transitions.duration.shorter,
    // }),
    margin: 0,
    borderRadius: 0,
    height: "100%",
    // height: "100vh",

    [breakpoints.up("xl")]: {
      backgroundColor: transparentSidenav ? background.default : background.default,
      boxShadow: transparentSidenav ? "none" : "none",
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: sidebarWidth,
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  // styles for the sidenav when miniSidenav={true}
  const drawerCloseStyles = () => ({
    transform: `translateX(${pxToRem(-320)})`,
    // transition: transitions.create("transform", {
    //   easing: transitions.easing.sharp,
    //   duration: transitions.duration.shorter,
    // }),
    margin: 0,
    borderRadius: 0,
    height: "100%",
    // height: "100vh",  
    
    [breakpoints.up("xl")]: {
      backgroundColor: transparentSidenav ? transparent.main : white.main,
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: pxToRem(96),
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    "& .MuiDrawer-paper": {
      boxShadow: xxl,
      border: "none",
      marginBottom: 0,
      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
    },
  };
});
