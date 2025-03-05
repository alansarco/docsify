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
  import { Grid, useMediaQuery } from "@mui/material";
import { DynamicTableHeight } from "components/General/TableHeight";

import React, { useEffect, useState } from "react";
import FixedLoading from "components/General/FixedLoading"; 
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import DataContainer from "layouts/inactive-campuses/components/DataContainer";

import Table from "layouts/inactive-campuses/data/table";
import { tablehead } from "layouts/inactive-campuses/data/head";  
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToErrorLogs } from "components/Api/Gateway";
import { passToSuccessLogs } from "components/Api/Gateway";
import CustomPagination from "components/General/CustomPagination";
import { useTheme } from "@emotion/react";
import TuneIcon from '@mui/icons-material/Tune';
import { minPaymenSelect,maxPaymenSelect } from "components/General/Utils";
import { toast } from "react-toastify";

function InactiveCampus() {
    const currentFileName = "layouts/inactive-campuses/index.js";
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
        min_payment: "",
        max_payment: "",
        subscription_start: "",
        subscription_end: "",
    };

    const [formData, setFormData] = useState(initialState);

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
    
    const HandleClear = (data) => {
      setFormData(initialState);
    };

    const HandleDATA = (data) => {
        setDATA(data);
    };

    const HandleRendering = (rendering) => {
        setRendering(rendering);
    };

    useEffect(() => {
      if (searchTriggered) {
        setReload(true);
        axios.post(apiRoutes.inactiveCampusRetrieve + '?page=' + 1, formData, {headers})
          .then(response => {
            setFetchdata(response.data.campuses);
            passToSuccessLogs(response.data, currentFileName);
            setReload(false);
            setFetching("No data Found!")
          })
          .catch(error => {
            passToErrorLogs(`Campus Data not Fetched!  ${error}`, currentFileName);
            setReload(false);
          });
        setSearchTriggered(false);
      }
    }, [searchTriggered]);

    const ReloadTable = () => {
        axios.post(apiRoutes.inactiveCampusRetrieve + '?page=' + page, formData, {headers})
        .then(response => {
        setFetchdata(response.data.campuses);
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
        if(parseInt(formData.min_payment) > parseInt(formData.max_payment) && formData.max_payment != '') {
          toast.warning('Min Payment must be lesser than Max Payment!', { autoClose: true });
        }
        else if(formData.subscription_start > formData.subscription_end && formData.subscription_end != '') {
          toast.warning('Subscription Start be lesser than Subscription End', { autoClose: true });
        }
        else {
          setReload(true);      
          try {
              const response = await axios.post(apiRoutes.inactiveCampusRetrieve + '?page=' + 1, formData, {headers});
              if(response.data.status == 200) {
                  setFetchdata(response.data.campuses);
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
        }
    };

  const fetchNextPrevTasks = (link) => {
    const url = new URL(link);
    const nextPage = url.searchParams.get('page');
    setPage(nextPage ? parseInt(nextPage) : 1);
    setReload(true);      

    // Trigger the API call again with the new page
    axios.post(apiRoutes.inactiveCampusRetrieve + '?page=' + nextPage, formData, {headers})
    .then(response => {
      setFetchdata(response.data.campuses);
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
          <SoftBox p={2}>
            <SoftBox >   
              <SoftBox className="px-md-4 px-3 py-2 d-block d-sm-flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                  <SoftTypography className="text-uppercase text-dark" variant="h6" >Inactive Campus List</SoftTypography>
                </SoftBox>
                <SoftBox display="flex" >
                  <SoftButton onClick={() => setShowFilter(!showFilter)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color={showFilter ? 'secondary' : 'success'} size="small" >
                    <TuneIcon size="15px" className="me-1" /> {showFilter ? 'hide' : 'show'} filter
                  </SoftButton>
                </SoftBox>
              </SoftBox>
              <Grid container direction={isSmallScreen ? "column-reverse" : "row"}  className="px-md-4 px-2 pt-3 pb-md-3 pb-2">
                <Grid item xs={12} lg={showFilter ? 9 : 12} className="p-4 rounded-5 bg-white shadow" width="100%">
                  <SoftBox className="mx-2 table-container" height={tableHeight} minHeight={50}>
                    {fetchdata && fetchdata.data && (fetchdata.data.length > 0) ? 
                      <Table table="sm" HandleDATA={HandleDATA} HandleRendering={HandleRendering} campuses={fetchdata.data} tablehead={tablehead} /> :
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
                            <SoftBox className="my-auto">
                              <SoftTypography variant="button" className="me-1">Subscription Start:</SoftTypography>
                              <input className="form-control form-control-sm text-secondary rounded-5"  name="subscription_start" value={formData.subscription_start} onChange={handleChange} type="date" />
                              <SoftTypography variant="button" className="me-1">Subscription End:</SoftTypography>
                              <input className="form-control form-control-sm text-secondary rounded-5"  name="subscription_end" value={formData.subscription_end} onChange={handleChange} type="date" />
                              <SoftTypography variant="button" className="me-1">Min. Payment:</SoftTypography>
                              <select className="form-select form-select-sm text-secondary cursor-pointer rounded-5 border" name="min_payment" value={formData.min_payment} onChange={handleChange} >
                                <option value="">-- Select --</option>
                                {minPaymenSelect && minPaymenSelect.map((min) => (
                                <option key={min.value} value={min.value}>
                                        {min.desc}
                                </option>
                                ))}
                              </select>
                              <SoftTypography variant="button" className="me-1">Max. Payment:</SoftTypography>
                              <select className="form-select form-select-sm text-secondary cursor-pointer rounded-5 border" name="max_payment" value={formData.max_payment} onChange={handleChange} >
                                <option value="">-- Select --</option>
                                {maxPaymenSelect && maxPaymenSelect.map((max) => (
                                <option key={max.value} value={max.value}>
                                        {max.desc}
                                </option>
                                ))}
                              </select>
                            </SoftBox>
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

export default InactiveCampus;