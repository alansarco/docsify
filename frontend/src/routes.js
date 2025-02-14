import Shop from "essentials/Icons/Shop";
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import FaceTwoToneIcon from '@mui/icons-material/FaceTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import SupportAgentTwoToneIcon from '@mui/icons-material/SupportAgentTwoTone';
import SupervisorAccountTwoToneIcon from '@mui/icons-material/SupervisorAccountTwoTone';
import BeenhereTwoToneIcon from '@mui/icons-material/BeenhereTwoTone';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import TerminalTwoToneIcon from '@mui/icons-material/TerminalTwoTone';
import TaskTwoToneIcon from '@mui/icons-material/TaskTwoTone';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import BackupTwoToneIcon from '@mui/icons-material/BackupTwoTone';
import ImportContactsTwoToneIcon from '@mui/icons-material/ImportContactsTwoTone';
import KeyOffTwoToneIcon from '@mui/icons-material/KeyOffTwoTone';

// React layouts
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ForgotPassword from "layouts/authentication/sign-in/forgot-password";

import Dashboard from "layouts/dashboard";
import Admins from "layouts/admins";
import Blank from "layouts/blank";
import Students from "layouts/students";
import Profile from "layouts/profile";
import Licenses from "layouts/licenses";
import Abouts from "layouts/abouts";
import Representatives from "layouts/representatives";
import ActiveCampus from "layouts/campuses";
import InactiveCampus from "layouts/inactive-campuses";
import LogAdmin from "layouts/log-admin";
import AdminSettings from "layouts/settings-admin";
import Registrars from "layouts/registrars";
import Sections from "layouts/sections";
import LogRepresentative from "layouts/log-representative";
import Programs from "layouts/programs";
import Documents from "layouts/documents";
import RepresentativeSettings from "layouts/settings-representative";
import ActiveRequest from "layouts/request-active";
import HistoryRequest from "layouts/request-history";
import ActiveTask from "layouts/task-active";
import HistoryTask from "layouts/task-history";
import StudentHistoryRequest from "layouts/task-history-student";
import StudentActiveRequest from "layouts/task-active-student";
import StudentStorage from "layouts/student-storage";

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

  // account-pages
  access >= 10 && { type: "title", title: "Accounts", key: "account-pages" },
  access == 999 && {
    type: "collapse",
    name: "Admins",
    key: "admins",
    route: "/admins",
    icon: <AdminPanelSettingsTwoToneIcon size="12px" />,
    component: <Admins />,
    noCollapse: true,
  },
  access == 999 && {
    type: "collapse",
    name: "Representatives",
    key: "representatives",
    route: "/representatives",
    icon: <SupportAgentTwoToneIcon size="12px" />,
    component: <Representatives />,
    noCollapse: true,
  },
  access == 30 && {
    type: "collapse",
    name: "Registrars",
    key: "registrars",
    route: "/registrars",
    icon: <SupervisorAccountTwoToneIcon size="12px" />,
    component: <Registrars />,
    noCollapse: true,
  },

  access >= 10 && access <= 30 && {
    type: "collapse",
    name: "Students",
    key: "students",
    route: "/students",
    icon: <FaceTwoToneIcon size="12px" />,
    component: <Students />,
    noCollapse: true,
  },
  //campus-pages
  access == 999 && { type: "title", title: "Campuses", key: "campus-pages" },
  access == 999 && {
    type: "collapse",
    name: "Active Campus",
    key: "active-campus",
    route: "/active-campus",
    icon: <BeenhereTwoToneIcon size="12px" />,
    component: <ActiveCampus />,
    noCollapse: true,
  },
  access == 999 && {
    type: "collapse",
    name: "Inactive Campus",
    key: "inactive-campus",
    route: "/inactive-campus",
    icon: <ArchiveTwoToneIcon size="12px" />,
    component: <InactiveCampus />,
    noCollapse: true,
  },
  
  //request-pages
  (access == 10 || access == 30) && { type: "title", title: "Document Requests", key: "request-pages" },
  (access == 10 || access == 30) && {
    type: "collapse",
    name: "Active",
    key: "active-requests",
    route: "/active-requests",
    icon: <TaskTwoToneIcon size="12px" />,
    component: <ActiveRequest />,
    noCollapse: true,
  },
  (access == 10 || access == 30) && {
    type: "collapse",
    name: "History",
    key: "request-history",
    route: "/request-history",
    icon: <ScheduleTwoToneIcon size="12px" />,
    component: <HistoryRequest />,
    noCollapse: true,
  },
  
  //school-pages
  access == 30 && { type: "title", title: "Campus Pages", key: "school-pages" },
  access == 30 && {
    type: "collapse",
    name: "Documents",
    key: "documents",
    route: "/documents",
    icon: <ArticleTwoToneIcon size="12px" />,
    component: <Documents />,
    noCollapse: true,
  },
  access == 30 && {
    type: "collapse",
    name: "Sections",
    key: "sections",
    route: "/sections",
    icon: <AccountBalanceTwoToneIcon size="12px" />,
    component: <Sections />,
    noCollapse: true,
  },
  access == 30 && {
    type: "collapse",
    name: "Programs",
    key: "programs",
    route: "/programs",
    icon: <TerminalTwoToneIcon size="12px" />,
    component: <Programs />,
    noCollapse: true,
  },

  //my-pages
  access == 10 && { type: "title", title: "My Tasks", key: "my-tasks" },
  access == 10 && {
    type: "collapse",
    name: "Active Tasks",
    key: "active-tasks",
    route: "/active-tasks",
    icon: <TaskTwoToneIcon size="12px" />,
    component: <ActiveTask />,
    noCollapse: true,
  },
  access == 10 && {
    type: "collapse",
    name: "Task History",
    key: "task-history",
    route: "/task-history",
    icon: <ScheduleTwoToneIcon size="12px" />,
    component: <HistoryTask />,
    noCollapse: true,
  },
  access == 5 && { type: "title", title: "My Requests", key: "my-requests" },
  access == 5 && {
    type: "collapse",
    name: "Active Requests",
    key: "my-active-requests",
    route: "/my-active-requests",
    icon: <TaskTwoToneIcon size="12px" />,
    component: <StudentActiveRequest />,
    noCollapse: true,
  },
  access == 5 && {
    type: "collapse",
    name: "Request History",
    key: "my-request-history",
    route: "/my-request-history",
    icon: <ScheduleTwoToneIcon size="12px" />,
    component: <StudentHistoryRequest />,
    noCollapse: true,
  },

  //others-pages
  { type: "title", title: "Others", key: "others-pages" },
  access == 999 && {
    type: "collapse",
    name: "Licenses",
    key: "licenses",
    route: "/licenses",
    icon: <KeyOffTwoToneIcon size="12px" />,
    component: <Licenses />,
    noCollapse: true,
  },
  access == 999 && {
    type: "collapse",
    name: "Logs",
    key: "admin-logs",
    route: "/admin-logs",
    icon: <ImportContactsTwoToneIcon size="12px" />,
    component: <LogAdmin />,
    noCollapse: true,
  },
  access == 30 && {
    type: "collapse",
    name: "Logs",
    key: "representative-logs",
    route: "/representative-logs",
    icon: <ImportContactsTwoToneIcon size="12px" />,
    component: <LogRepresentative />,
    noCollapse: true,
  },

  access == 999 && {
    type: "collapse",
    name: "Settings",
    key: "admin-settings",
    route: "/admin-settings",
    icon: <SettingsTwoToneIcon size="12px" />,
    component: <AdminSettings />,
    noCollapse: true,
  },

  access == 30 && {
    type: "collapse",
    name: "Settings",
    key: "settings",
    route: "/settings",
    icon: <SettingsTwoToneIcon size="12px" />,
    component: <RepresentativeSettings />,
    noCollapse: true,
  },
  access == 5 && {
    type: "collapse",
    name: "Personal Storage",
    key: "personal-storage",
    route: "/personal-storage",
    icon: <BackupTwoToneIcon size="12px" />,
    component: <StudentStorage />,
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
    key: "profile",
    route: "/profile",
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
