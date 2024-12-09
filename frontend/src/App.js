import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// React examples
import Sidenav from "essentials/Sidenav";
import Configurator from "essentials/Configurator";

// React themes
import theme from "assets/theme";

// React routes
import routes from "routes";

// React contexts
import { useSoftUIController, setMiniSidenav } from "context";

import { useStateContext } from "context/ContextProvider";

export default function App() {
  const { token, access } = useStateContext(); // get access value from context
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const isSignInOrSignUp =
    pathname === "/authentication/sign-in" ||
    pathname === "/authentication/sign-in/admin" ||
    pathname === "/authentication/admin/forgot-password" ||
    pathname === "/authentication/forgot-password" ||
    pathname === "/authentication/sign-up" ||
    pathname === "/user-app";

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  // Pass access as a prop to routes.js
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && token && !isSignInOrSignUp && (
        <>
          <Sidenav
            color={sidenavColor}
            routes={routes(access)} // Pass access here
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}
      <Configurator />
      <Routes>
        {getRoutes(routes(access))} {/* Pass access here */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProvider>
  );
}