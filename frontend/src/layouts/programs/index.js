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
  import { Grid, useMediaQuery } from "@mui/material";
import { DynamicTableHeight } from "components/General/TableHeight";

import React, { useEffect, useState } from "react";
import FixedLoading from "components/General/FixedLoading"; 
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import DataContainer from "layouts/programs/components/DataContainer";
import Add from "layouts/programs/components/Add";

import Table from "layouts/programs/data/table";
import { tablehead } from "layouts/programs/data/head";  
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToErrorLogs } from "components/Api/Gateway";
import { passToSuccessLogs } from "components/Api/Gateway";
import CustomPagination from "components/General/CustomPagination";
import { genderSelect } from "components/General/Utils";
import { statusSelect } from "components/General/Utils";
import TuneIcon from '@mui/icons-material/Tune';
import { useTheme } from "@emotion/react";

function Programs() {
    const currentFileName = "layouts/programs/index.js";
    const {token, access, updateTokenExpiration, role} = useStateContext();
    updateTokenExpiration();
    if (!token) {
        return <Navigate to="/authentication/sign-in" />
    }
    else if(token && access < 10) {
        return <Navigate to="/not-found" />
    }
    
    const [showFilter, setShowFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [fetching, setFetching] = useState("");
    const [searchTriggered, setSearchTriggered] = useState(true);

    const [reload, setReload] = useState(false);

    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

    const initialState = {
        filter: "",
    };

    const [formData, setFormData] = useState(initialState);

    const HandleClear = (user) => {
      setFormData(initialState);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
              setFormData({ ...formData, [name]: !formData[name]});
        } else {
              setFormData({ ...formData, [name]: value });
        }
    };

    const [DATA, setDATA] = useState(); 
    const [rendering, setRendering] = useState(1);
    const [fetchdata, setFetchdata] = useState([]);
    const tableHeight = DynamicTableHeight();  

    const HandleDATA = (data) => {
      setDATA(data);
    };

    const HandleRendering = (rendering) => {
        setRendering(rendering);
    };

    useEffect(() => {
      if (searchTriggered) {
        setReload(true);
        axios.post(apiRoutes.programRetrieve + '?page=' + 1, formData, {headers})
          .then(response => {
            setFetchdata(response.data.programs);
            passToSuccessLogs(response.data, currentFileName);
            setReload(false);
            setFetching("No data Found!")
          })
          .catch(error => {
            passToErrorLogs(`Document Data not Fetched!  ${error}`, currentFileName);
            setReload(false);
          });
        setSearchTriggered(false);
      }
    }, [searchTriggered]);

    const ReloadTable = () => {
        axios.post(apiRoutes.programRetrieve + '?page=' + page, formData, {headers})
        .then(response => {
        setFetchdata(response.data.programs);
        passToSuccessLogs(response.data, currentFileName);
        setReload(false);      
        })
        .catch(error => {
        setReload(false);      
        console.error('Error fetching data for the next page:', error);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setReload(true);      
        try {
            const response = await axios.post(apiRoutes.programRetrieve + '?page=' + 1, formData, {headers});
            if(response.data.status == 200) {
                setFetchdata(response.data.programs);
            }
            else {
                setFetchdata([]);
                setFetching("No data Found!");
            }
            passToSuccessLogs(response.data, currentFileName);
            setReload(false);
        } catch (error) { 
            passToErrorLogs(error, currentFileName);
            setReload(false);
        }     
        setReload(false);
    };

  const fetchNextPrevTasks = (link) => {
    const url = new URL(link);
    const nextPage = url.searchParams.get('page');
    setPage(nextPage ? parseInt(nextPage) : 1);
    setReload(true);      

    // Trigger the API call again with the new page
    axios.post(apiRoutes.programRetrieve + '?page=' + nextPage, formData, {headers})
    .then(response => {
      setFetchdata(response.data.programs);
      passToSuccessLogs(response.data, currentFileName);
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <> 
      {reload && <FixedLoading />} 
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={rendering} /> 
          {DATA && rendering == 2 ? 
            <DataContainer DATA={DATA} HandleRendering={HandleRendering} ReloadTable={ReloadTable} />       
          :
          rendering == 3 ?
            <Add HandleRendering={HandleRendering} ReloadTable={ReloadTable} />
          :
          <SoftBox p={2}>
            <SoftBox >   
              <SoftBox className="px-md-4 px-3 py-2 d-block d-sm-flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                  <SoftTypography className="text-uppercase text-dark" variant="h6" >Program List</SoftTypography>
                </SoftBox>
                <SoftBox display="flex" >
                  <SoftButton onClick={() => setShowFilter(!showFilter)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color={showFilter ? 'secondary' : 'success'} size="small" >
                    <TuneIcon size="15px" className="me-1" /> {showFilter ? 'hide' : 'show'} filter
                  </SoftButton>
                  <SoftButton onClick={() => setRendering(3)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color="dark" size="small" >
                    <Icon>add</Icon> Add Program
                  </SoftButton>
                </SoftBox>
              </SoftBox>
              <Grid container direction={isSmallScreen ? "column-reverse" : "row"}  className="px-md-4 px-2 pt-3 pb-md-3 pb-2">
                <Grid item xs={12} lg={showFilter ? 9 : 12} className="p-4 rounded-5 bg-white shadow" width="100%">
                  <SoftBox className="mx-2 table-container" height={tableHeight} minHeight={50}>
                    {fetchdata && fetchdata.data && fetchdata.data.length > 0 ? 
                      <Table table="sm" HandleDATA={HandleDATA} HandleRendering={HandleRendering} DATA={fetchdata.data} tablehead={tablehead} /> :
                      <>
                      <SoftBox className="d-flex" height="100%">
                        <SoftTypography variant="h6" className="m-auto text-secondary">   
                        {fetchdata && fetchdata.data && fetchdata.data.length < 1 ? "No data Found" : fetching}                    
                        </SoftTypography>
                      </SoftBox>
                      </>
                    }
                  </SoftBox>
                  {fetchdata && fetchdata.data && fetchdata.data.length > 0 && <SoftBox>{renderPaginationLinks()}</SoftBox>}
                </Grid>
                {showFilter &&
                <Grid item xs={12} lg={3} mb={3}>
                <SoftBox component="form" role="form" className="ms-lg-3 px-3 px-4 mt-2 rounded-5 bg-white shadow" onSubmit={handleSubmit}>
                    <Grid container spacing={1} py={1} pb={2}>  
                        <Grid item xs={12}>
                            <SoftTypography className="me-2 my-auto h6 text-info fw-bold">Filter Result:</SoftTypography>
                            <SoftInput 
                              className="my-3"
                              value={formData.filter}
                              onChange={handleChange}
                              placeholder="Search here..." name="filter" size="small"
                            />
                            <Grid container display="flex" justifyContent="end">
                              <Grid item xs={12} xl={6} className="px-0 px-lg-1 mt-2 mt-xl-0">
                                <SoftButton onClick={HandleClear}  className="px-3 rounded-0 rounded-pill w-100" variant="gradient" color="secondary" size="small" >
                                  clear
                                </SoftButton>
                              </Grid>
                              <Grid item xs={12} xl={6} className="px-0 px-lg-1 mt-2 mt-xl-0">
                                <SoftButton className="px-3 rounded-0 rounded-pill w-100" variant="gradient" color="info" size="small" type="submit">
                                  search
                                </SoftButton>
                              </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </SoftBox>
                </Grid>
                }
                
              </Grid>
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

export default Programs;