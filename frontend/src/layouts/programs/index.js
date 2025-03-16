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
import { activeSelect } from "components/General/Utils";
import SearchIcon from '@mui/icons-material/Search';

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
        status: "",
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
                  <SoftBox component="form" role="form" className="d-flex align-items-center" onSubmit={handleSubmit}>
                    <select className="form-select form-select-sm text-secondary cursor-pointer border me-2" 
                    style={{ borderRadius: "100px 100px 100px 100px" }} name="status" value={formData.status} onChange={handleChange} >
                        <option value="">-- Select Status--</option>
                        {activeSelect && activeSelect.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.desc}
                        </option>
                        ))}
                    </select>
                    <SoftInput value={formData.filter} onChange={handleChange} placeholder="Search here..."
                      name="filter" size="small" className="flex-grow-1"
                      sx={{ borderRadius: "100px 0 0 100px" }} 
                    />
                    <SoftButton  variant="gradient" color="info" size="medium" type="submit" iconOnly 
                      sx={{ borderRadius: "0 100px 100px 0" }} 
                    >
                      <SearchIcon />
                    </SoftButton>
                  </SoftBox>
                  <SoftButton onClick={() => setRendering(3)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color="dark" size="small" >
                    <Icon>add</Icon> Add Program
                  </SoftButton>
                </SoftBox>
              </SoftBox>
              <Grid container className="px-md-4 px-2 pt-3 pb-md-3 pb-2">
                <Grid item xs={12} className="p-4 rounded-5 bg-white shadow" width="100%">
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