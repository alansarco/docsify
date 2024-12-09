// React layouts
import Dashboard from "layouts/dashboard";
import Admins from "layouts/admins";
import Users from "layouts/users";
import Blank from "layouts/blank";
import Residents from "layouts/residents";
import Announcements from "layouts/announcements";
import Profile from "layouts/profile";
import Documents from "layouts/documents";
import Settings from "layouts/settings";
import Abouts from "layouts/abouts";
import Reports from "layouts/reports";
import Officials from "layouts/officials";
import DocRequest from "layouts/requests";

import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ForgotPassword from "layouts/authentication/sign-in/forgot-password";

import Shop from "essentials/Icons/Shop";
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import FaceTwoToneIcon from '@mui/icons-material/FaceTwoTone';
import CampaignTwoToneIcon from '@mui/icons-material/CampaignTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import OutlinedFlagTwoToneIcon from '@mui/icons-material/OutlinedFlagTwoTone';
import DocumentScannerTwoToneIcon from '@mui/icons-material/DocumentScannerTwoTone';
import Groups3TwoToneIcon from '@mui/icons-material/Groups3TwoTone';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';

// Accept access as a parameter
const routes = (access) => [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },

  // Conditionally render the Accounts menu and its submenus based on access
  access == 999 && { type: "title", title: "Accounts", key: "account-pages" },
  access == 999 && {
    type: "collapse",
    name: "Users",
    key: "users",
    route: "/users",
    icon: <GroupTwoToneIcon size="12px" />,
    component: <Users />,
    noCollapse: true,
  },
  access == 999 && {
    type: "collapse",
    name: "Admins",
    key: "admins",
    route: "/admins",
    icon: <AdminPanelSettingsTwoToneIcon size="12px" />,
    component: <Admins />,
    noCollapse: true,
  },

  access == 999 && { type: "title", title: "Residents", key: "resident-pages" },
  access == 999 && {
    type: "collapse",
    name: "Residents",
    key: "residents",
    route: "/residents",
    icon: <FaceTwoToneIcon size="12px" />,
    component: <Residents />,
    noCollapse: true,
  },
  { type: "title", title: "Pages", key: "pages" },
  {
    type: "collapse",
    name: "Announcements",
    key: "announcements",
    route: "/announcements",
    icon: <CampaignTwoToneIcon size="12px" />,
    component: <Announcements />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports",
    icon: <OutlinedFlagTwoToneIcon size="12px" />,
    component: <Reports />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Docu. Request",
    key: "document-requests",
    route: "/document-requests",
    icon: <DocumentScannerTwoToneIcon size="12px" />,
    component: <DocRequest />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Officials",
    key: "officials",
    route: "/officials",
    icon: <Groups3TwoToneIcon size="12px" />,
    component: <Officials />,
    noCollapse: true,
  },
  { type: "title", title: "Others", key: "others" },
  access == 999 && {
    type: "collapse",
    name: "Documents",
    key: "documents",
    route: "/documents",
    icon: <ArticleTwoToneIcon size="12px" />,
    component: <Documents />,
    noCollapse: true,
  },
  access == 999 && {
    type: "collapse",
    name: "System Settings",
    key: "settings",
    route: "/settings",
    icon: <SettingsTwoToneIcon size="12px" />,
    component: <Settings />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "About",
    key: "about",
    route: "/about",
    icon: <InfoTwoToneIcon size="12px" />,
    component: <Abouts />,
    noCollapse: true,
  },
  {
    type: "",
    name: "Not Found",
    key: "not-found",
    route: "/not-found",
    icon: <InfoTwoToneIcon size="12px" />,
    component: <Blank />,
    noCollapse: true,
  },
  {
    type: "",
    name: "Profile",
    key: "change-password",
    route: "/change-password",
    icon: <InfoTwoToneIcon size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <InfoTwoToneIcon size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "",
    name: "Forgot Password",
    key: "forgot-password",
    route: "/authentication/forgot-password",
    icon: <InfoTwoToneIcon size="12px" />,
    component: <ForgotPassword />,
    noCollapse: true,
  },
  {
    type: "",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <InfoTwoToneIcon size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
].filter(Boolean); // Filter out `null` values from the array

export default routes;
