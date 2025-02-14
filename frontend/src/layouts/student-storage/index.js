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

import Table from "layouts/student-storage/data/table";
import { tablehead } from "layouts/student-storage/data/head";  
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToErrorLogs } from "components/Api/Gateway";
import { passToSuccessLogs } from "components/Api/Gateway";
import CustomPagination from "components/General/CustomPagination";
import { useDashboardData } from "layouts/dashboard/data/dashboardRedux";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from "react-toastify";

function StudentStorage() {
    const currentFileName = "layouts/student-storage/index.js";
    const {token, access, updateTokenExpiration, role} = useStateContext();
    updateTokenExpiration();
    if (!token) {
        return <Navigate to="/authentication/sign-in" />
    }
    else if(token && access < 5) {
        return <Navigate to="/not-found" />
    }
    const { 
      authUser,
    } = useDashboardData({
      authUser: true, 
      otherStats: false, 
    }); 
    
    const [page, setPage] = useState(1);
    const [fetching, setFetching] = useState("");
    const [searchTriggered, setSearchTriggered] = useState(true);

    const [reload, setReload] = useState(false);

    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

    const [rendering, setRendering] = useState(1);
    const [fetchdata, setFetchdata] = useState([]);
    const tableHeight = DynamicTableHeight();  
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");

    useEffect(() => {
      if (searchTriggered) {
        setReload(true);
        axios.get(apiRoutes.storageRetrieve + '?page=' + 1, {headers})
          .then(response => {
            setFetchdata(response.data.filedata);
            passToSuccessLogs(response.data, currentFileName);
            setReload(false);
            setFetching("No data Found!")
          })
          .catch(error => {
            passToErrorLogs(`Sections Data not Fetched!  ${error}`, currentFileName);
            setReload(false);
          });
        setSearchTriggered(false);
      }
    }, [searchTriggered]);

    const ReloadTable = () => {
        axios.get(apiRoutes.storageRetrieve + '?page=' + page, {headers})
        .then(response => {
        setFetchdata(response.data.filedata);
        passToSuccessLogs(response.data, currentFileName);
        setReload(false);      
        })
        .catch(error => {
        setReload(false);      
        console.error('Error fetching data for the next page:', error);
        });
    }

  const fetchNextPrevTasks = (link) => {
    const url = new URL(link);
    const nextPage = url.searchParams.get('page');
    setPage(nextPage ? parseInt(nextPage) : 1);
    setReload(true);      

    // Trigger the API call again with the new page
    axios.get(apiRoutes.storageRetrieve + '?page=' + nextPage, {headers})
    .then(response => {
      setFetchdata(response.data.filedata);
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


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.'); // Remove the extension
      setFileName(nameWithoutExt); // Store the name without the extension
      const fileType = file.name.split('.').pop().toLowerCase(); // Get the file extension as type
      setFileType(fileType); // Store the file type (e.g., pdf, docx, jpg)
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select new file to upload!", { autoClose: true });
      return;
    }
  
    const formData = new FormData();
    formData.append('fileData', selectedFile);
    formData.append('fileName', fileName); // Pass the file name
    formData.append('fileType', fileType); // Pass the file type
  
    try {
      setSearchTriggered(true); // Refresh data after upload
      const response = await axios.post(apiRoutes.uploadStorageData, formData, {
        headers: {
          'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      if(response.data.status == 200) {
        toast.success(`${response.data.message}`, { autoClose: true });
        ReloadTable();
        setSelectedFile(null); 
        setFileType(""); 
        setFileName(""); // Reset file name
        passToSuccessLogs(response.data, currentFileName);
      } else {
        toast.error(`${response.data.message}`, { autoClose: true });
        passToErrorLogs(response.data, currentFileName);

      }
    } catch (error) {
      toast.error("Failed to upload file.", { autoClose: true });
    }
  };
  


  return (
    <> 
      {reload && <FixedLoading />} 
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={rendering} /> 
          <SoftBox p={2}>
            <SoftBox >   
              <SoftBox className="px-md-4 px-3 py-2 d-block d-sm-flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                  <SoftTypography className="text-uppercase text-dark" variant="h6" >
                  Your Personal Storage
                    {authUser.file_limit &&
                      <SoftTypography className="ms-2 text-md" color="primary" textGradient variant="button" >
                        Limit: ({authUser.file_limit} files)
                      </SoftTypography>
                    }
                  </SoftTypography>
                </SoftBox>
                <SoftBox display="flex" alignItems="center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpeg,.png,.jpg,.gif,.pdf,.xlsx,.xls,.csv,.ppt,.pptx,.doc,.docx,.zip"
                    className="form-control form-control-sm rounded-5 text-xs"
                  />
                  <SoftButton
                    className="ms-2 px-3 d-flex rounded-pill"
                    variant="gradient"
                    color="dark"
                    size="small"
                    onClick={handleUpload}
                  >
                    <CloudUploadIcon className="me-1" /> Upload
                  </SoftButton>
                </SoftBox>
              </SoftBox>
              <Grid container className="px-md-4 px-2 pt-3 pb-md-3 pb-2">
                <Grid item xs={12} className="p-4 rounded-5 bg-white shadow" width="100%">
                  <SoftBox className="mx-2 table-container" height={tableHeight} minHeight={50}>
                    {fetchdata && fetchdata.data && fetchdata.data.length > 0 ? 
                      <Table table="sm" ReloadTable ={ReloadTable } DATA={fetchdata.data} tablehead={tablehead} /> :
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

export default StudentStorage;