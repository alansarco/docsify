// @mui material components
import Card from "@mui/material/Card";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { ToastContainer } from 'react-toastify';

import Icon from "@mui/material/Icon";

// React examples
import DashboardLayout from "essentials/LayoutContainers/DashboardLayout";
import DashboardNavbar from "essentials/Navbars"; 
import Footer from "essentials/Footer";

// Data
  import { Grid } from "@mui/material";
import { DynamicTableHeight } from "components/General/TableHeight";

import React, { useState, useEffect } from "react";
import FixedLoading from "components/General/FixedLoading"; 
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import UserContainer from "layouts/users/components/UserContainer";

import Table from "layouts/admins/data/table";
import { tablehead } from "layouts/admins/data/head";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToErrorLogs } from "components/Api/Gateway";
import { passToSuccessLogs } from "components/Api/Gateway";
import CustomPagination from "components/General/CustomPagination";

function Admins() {
  const currentFileName = "layouts/admins/index.js";
  const {token, access, role, updateTokenExpiration} = useStateContext();
  updateTokenExpiration();
  if (!token) {
    return <Navigate to="/authentication/sign-in" />
  }
  else if(token && access < 10) {
    return <Navigate to="/not-found" />
  }
  
  const [searchTriggered, setSearchTriggered] = useState(true);
  const [filter, setFilter] = useState();
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState("");

  const [reload, setReload] = useState(false);
  
  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const [USER, setUSER] = useState(); 
  const [rendering, setRendering] = useState(1);
  const [fetchdata, setFetchdata] = useState([]);
  const tableHeight = DynamicTableHeight();
  
  const HandleUSER= (user) => {
    setUSER(user);
  };

  const HandleRendering = (rendering) => {
    setRendering(rendering);
  };

  const ReloadTable = () => {
    axios.get(apiRoutes.adminRetrieve + '?page=' + page, { params: { filter }, headers })
    .then(response => {
      setFetchdata(response.data.admins);
      passToSuccessLogs(response.data, currentFileName);
      setReload(false);
      setFetching("No data Found!")
    })
    .catch(error => {
      passToErrorLogs(`Admin Data not Fetched!  ${error}`, currentFileName);
      setReload(false);
    });
  }

  const handleSearchAndButtonClick = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault(); // Prevent form submission
      const inputElement = document.getElementById('yourInputId');
      const inputValue = inputElement.value;
      setFilter(inputValue);
      setSearchTriggered(true);
    }
  };
  
  useEffect(() => {
    if (searchTriggered) {
      setReload(true);
      axios.get(apiRoutes.adminRetrieve + '?page=' + page, { params: { filter }, headers })
        .then(response => {
          setFetchdata(response.data.admins);
          passToSuccessLogs(response.data, currentFileName);
          setReload(false);
          setFetching("No data Found!")
        })
        .catch(error => {
          passToErrorLogs(`Admin Data not Fetched!  ${error}`, currentFileName);
          setReload(false);
        });
      setSearchTriggered(false);
    }
  }, [searchTriggered]);

  const fetchNextPrevTasks = (link) => {
    const url = new URL(link);
    const nextPage = url.searchParams.get('page');
    setPage(nextPage ? parseInt(nextPage) : 1);
    setReload(true);      

    // Trigger the API call again with the new page
    axios.get(apiRoutes.adminRetrieve + '?page=' + nextPage, { params: { filter }, headers })
    .then(response => {
      setFetchdata(response.data.admins);
      setReload(false);      
    })
    .catch(error => {
      setReload(false);      
      console.error('Error fetching data for the next page:', error);
    });
  };
  
  const renderPaginationLinks = () => (
    <CustomPagination fetchdata={fetchdata} fetchNextPrevTasks={fetchNextPrevTasks} />
  )

  return (
    <> 
      {reload && <FixedLoading />} 
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={rendering} />   
        {USER && rendering == 2 ? 
            <UserContainer USER={USER} HandleRendering={HandleRendering} ReloadTable={ReloadTable} />       
          :
        <SoftBox p={2}>
          <SoftBox >   
            <SoftBox className="px-md-4 px-3 py-2" display="flex" justifyContent="space-between" alignItems="center">
              <SoftBox>
                <SoftTypography className="text-uppercase text-secondary" variant="h6" >Admin Account List</SoftTypography>
              </SoftBox>
            </SoftBox>
            <Card className="px-md-4 px-2 pt-3 pb-md-5 pb-4">
              <Grid container spacing={1} py={1} pb={2}>
                <Grid item xs={12} md={8} display="flex">
                  <SoftTypography className="text-xs my-auto px-2 text-dark">
                    <b className="text-info">Note:</b> These are the residents with ADMIN ACCESS LEVEL, which can perform ALL system functionalities.
                  </SoftTypography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <SoftBox className="px-md-0 px-2" display="flex" margin="0" justifyContent="end">
                        <SoftInput
                          placeholder="Search here..."
                          icon={{
                            component: 'search',
                            direction: 'right',
                          }}
                          size="small"
                          onKeyDown={handleSearchAndButtonClick}
                          id="yourInputId" // Add an ID to the input element
                        />
                        <SoftButton
                          className="px-3 rounded-0 rounded-right"
                          variant="gradient"
                          color="info"
                          size="medium"
                          iconOnly
                          onClick={handleSearchAndButtonClick}
                        >
                          <Icon>search</Icon>
                        </SoftButton>
                      </SoftBox>
                </Grid>
              </Grid>
              <SoftBox className="shadow-none table-container px-md-1 px-3 bg-gray rounded-5" height={tableHeight} minHeight={50}>
                  {fetchdata && fetchdata.data && fetchdata.data.length > 0 ? 
                    <Table table="sm" HandleUSER={HandleUSER} HandleRendering={HandleRendering} admins={fetchdata.data} tablehead={tablehead} /> :
                    <>
                    <SoftBox className="d-flex" height="100%">
                      <SoftTypography variant="h6" className="m-auto text-secondary">   
                      {fetchdata && fetchdata.data && fetchdata.data.length == 0 ? "No data Found" : fetching}                    
                      </SoftTypography>
                    </SoftBox>
                    </>
                  }
                </SoftBox>
                {fetchdata && fetchdata.data && fetchdata.data.length > 0 && <SoftBox>{renderPaginationLinks()}</SoftBox>}
            </Card>
          </SoftBox>
        </SoftBox>
        }
        <Footer />
      </DashboardLayout>
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

export default Admins;