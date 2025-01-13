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

import React, { useEffect, useState } from "react";
import FixedLoading from "components/General/FixedLoading"; 
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import UserContainer from "layouts/users/components/UserContainer";
import Add from "layouts/users/components/Add";

import Table from "layouts/students/data/table";
import { tablehead } from "layouts/students/data/head";  
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToErrorLogs } from "components/Api/Gateway";
import { passToSuccessLogs } from "components/Api/Gateway";
import CustomPagination from "components/General/CustomPagination";
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import UploadStudents from "layouts/students/components/UploadStudents";
import { genderSelect } from "components/General/Utils";
import { years } from "components/General/Utils";
import { statusSelect } from "components/General/Utils";

function Students() {
    const currentFileName = "layouts/students/index.js";
    const {token, access, updateTokenExpiration, role} = useStateContext();
    updateTokenExpiration();
    if (!token) {
        return <Navigate to="/authentication/sign-in" />
    }
    else if(token && access < 10) {
        return <Navigate to="/not-found" />
    }
    
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
        account_status: "",
        gender: "",
        year: "",
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

    const [USER, setUSER] = useState(); 
    const [rendering, setRendering] = useState(1);
    const [fetchdata, setFetchdata] = useState([]);
    const tableHeight = DynamicTableHeight();  

    const HandleUSER = (user) => {
        setUSER(user);
    };

    const HandleRendering = (rendering) => {
        setRendering(rendering);
    };

    useEffect(() => {
      if (searchTriggered) {
        setReload(true);
        axios.post(apiRoutes.residentsRetrieve + '?page=' + 1, formData, {headers})
          .then(response => {
            setFetchdata(response.data.users);
            passToSuccessLogs(response.data, currentFileName);
            setReload(false);
            setFetching("No data Found!")
          })
          .catch(error => {
            passToErrorLogs(`Stuents Data not Fetched!  ${error}`, currentFileName);
            setReload(false);
          });
        setSearchTriggered(false);
      }
    }, [searchTriggered]);

    const ReloadTable = () => {
        axios.post(apiRoutes.residentsRetrieve + '?page=' + page, formData, {headers})
        .then(response => {
        setFetchdata(response.data.users);
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
            const response = await axios.post(apiRoutes.residentsRetrieve + '?page=' + 1, formData, {headers});
            if(response.data.status == 200) {
                setFetchdata(response.data.users);
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
    axios.post(apiRoutes.residentsRetrieve + '?page=' + nextPage, formData, {headers})
    .then(response => {
      setFetchdata(response.data.users);
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

  return (
    <> 
      {reload && <FixedLoading />} 
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={rendering} /> 
          {USER && rendering == 2 ? 
            <UserContainer USER={USER} HandleRendering={HandleRendering} ReloadTable={ReloadTable} />       
          :
          rendering == 3 ?
            <Add HandleRendering={HandleRendering} ReloadTable={ReloadTable} />
        :
          rendering == 4 ?
            <UploadStudents HandleRendering={HandleRendering} ReloadTable={ReloadTable} />
        :
          <SoftBox p={2}>
            <SoftBox >   
              <SoftBox className="px-md-4 px-3 py-2 d-block d-sm-flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                  <SoftTypography className="text-uppercase text-secondary" variant="h6" >Residents List</SoftTypography>
                </SoftBox>
                {access == 999 && role === "ADMIN" &&
                <SoftBox display="flex" >
                  <SoftButton onClick={() => setRendering(4)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color="warning" size="small" >
                    <CloudUploadTwoToneIcon size="15px" className="me-1" /> upload excel
                  </SoftButton>
                  <SoftButton onClick={() => setRendering(3)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color="info" size="small" >
                    <Icon>add</Icon> Add Residents
                  </SoftButton>
                </SoftBox>
                }
              </SoftBox>
              <Card className="px-md-4 px-2 pt-3 pb-md-3 pb-2">
                <SoftBox component="form" role="form" className="px-md-0 px-2" onSubmit={handleSubmit}>
                    <Grid container spacing={1} py={1} pb={2}>  
                        <Grid item xs={12} lg={8} className="d-block d-md-flex">
                            <SoftTypography variant="button" className="me-2 my-auto">Filter Result:</SoftTypography>
                            <SoftBox className="my-auto">
                            <select className="form-select-sm text-secondary rounded-5 me-2 cursor-pointer border span" name="year_enrolled" value={formData.year_enrolled} onChange={handleChange} >
                                <option value="">-- Year of Residency --</option>
                                {years && years.map((year) => (
                                <option key={year} value={year}>
                                        {year}
                                </option>
                                ))}
                            </select>
                            <select className="form-select-sm text-secondary rounded-5 me-2 cursor-pointer border span" name="account_status" value={formData.account_status} onChange={handleChange} >
                                <option value="">-- Account Status --</option>
                                {statusSelect && statusSelect.map((status) => (
                                <option key={status.value} value={status.value}>
                                        {status.desc}
                                </option>
                                ))}
                            </select>
                            <select className="form-select-sm text-secondary rounded-5 cursor-pointer border span"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              >
                              <option value="">-- Gender --</option>
                              {genderSelect && genderSelect.map((gender) => (
                                <option key={gender.value} value={gender.value}>
                                  {gender.desc}
                                </option>
                              ))}
                            </select>
                            </SoftBox>
                        </Grid>   
                        <Grid item xs={12} lg={4}>  
                            <SoftBox className="px-md-0 px-2" display="flex" margin="0" justifyContent="end">
                                <SoftInput 
                                    value={formData.filter}
                                    onChange={handleChange}
                                    placeholder="Search here..." name="filter" size="small"
                                    icon={{
                                        component: 'search',
                                        direction: 'right',
                                    }}
                                />
                                <SoftButton className="px-3 rounded-0 rounded-right" variant="gradient" color="info" size="medium" iconOnly type="submit">
                                    <Icon>search</Icon>
                                </SoftButton>
                            </SoftBox>
                        </Grid>
                    </Grid>
                </SoftBox>
                <SoftBox className="shadow-none table-container px-md-1 px-3 bg-gray rounded-5" height={tableHeight} minHeight={50}>
                  {fetchdata && fetchdata.data && fetchdata.data.length > 0 ? 
                    <Table table="sm" HandleUSER={HandleUSER} HandleRendering={HandleRendering} users={fetchdata.data} tablehead={tablehead} /> :
                    <>
                    <SoftBox className="d-flex" height="100%">
                      <SoftTypography variant="h6" className="m-auto text-secondary">   
                      {fetchdata && fetchdata.data && fetchdata.data.users.length < 1 ? "No data Found" : fetching}                    
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

export default Students;