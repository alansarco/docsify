// React examples
import DashboardLayout from "essentials/LayoutContainers/DashboardLayout";
import Footer from "essentials/Footer";

// Overview page components
import ProfileContainer from "layouts/profile/components/ProfileContainer";
import { ToastContainer } from 'react-toastify';

import DashboardNavbar from "essentials/Navbars";
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import { useDashboardData } from "layouts/dashboard/data/dashboardRedux";
import FixedLoading from "components/General/FixedLoading";

function Profile() {
  const {token, access, updateTokenExpiration} = useStateContext();
  updateTokenExpiration();
  if (!token) {
    return <Navigate to="/authentication/sign-in" />
  }
  
  const {authUser, loadAuthUser} = useDashboardData({
    authUser: true, 
    otherStats: false, 
    polls: false
  }, []);

  return (
    <>
    {loadAuthUser && <FixedLoading />} 
    <DashboardLayout>
      <DashboardNavbar RENDERNAV="1"  /> 
      <ProfileContainer authUser={authUser}/>
      <Footer />
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
    </DashboardLayout>
    </>
  );
}

export default Profile;
