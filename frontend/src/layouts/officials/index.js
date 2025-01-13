// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import 'chart.js/auto';
// React examples
import DashboardLayout from "essentials/LayoutContainers/DashboardLayout";
import DashboardNavbar from "essentials/Navbars";
import Footer from "essentials/Footer";
import { ToastContainer, toast } from 'react-toastify';

// React base styles
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Icon from "@mui/material/Icon";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
// Data
import TimelineList from "essentials/Timeline/TimelineList";
import TimelineItem from "essentials/Timeline/TimelineItem";
import Add from "layouts/officials/components/Add";
import Edit from "layouts/officials/components/Edit";
import FixedLoading from "components/General/FixedLoading";
import { passToSuccessLogs, passToErrorLogs } from "components/Api/Gateway";

import React, { useState, useEffect } from "react";
import { useStateContext } from "context/ContextProvider";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";

function Officials() {
  const currentFileName = "layouts/officials/index.js";
  const {token, access, role, updateTokenExpiration} = useStateContext();
  updateTokenExpiration();
  if (!token) {
    return <Navigate to="/authentication/sign-in" />
  }

  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const [DATA, setRetrieveOne] = useState(); 
  const [reload, setReload] = useState(false);
  const [rendering, setRendering] = useState(1);
  const [fetchdata, setFetchdata] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(true);

  const HandleRendering = (rendering) => {
    setRendering(rendering);
  };

  const handleUpdate = (id) => {
    setReload(true);
    axios.get(apiRoutes.retrieveOfficialOne, { params: { id }, headers })
      .then(response => {
        if (response.data.status === 200) {
          setRendering(2);
          setRetrieveOne(response.data.calendar);  
        } else {
          toast.error(`${response.data.message}`, { autoClose: true });
        }
        passToSuccessLogs(response.data, currentFileName);
        setReload(false);
      })  
      .catch(error => {
        passToErrorLogs(`Official not Fetched!  ${error}`, currentFileName);
        setReload(false);
      });
  };

  const ReloadTable = () => {
    axios.get(apiRoutes.retrieveOfficials, {headers} )
    .then(response => {
      setFetchdata(response.data.officials);
      passToSuccessLogs(response.data, currentFileName);
      setReload(false);
    })
    .catch(error => {
      passToErrorLogs(`Officials not Fetched!  ${error}`, currentFileName);
      setReload(false);
    });
  }

  useEffect(() => {
    if (searchTriggered) {
      setReload(true);
      axios.get(apiRoutes.retrieveOfficials, {headers} )
        .then(response => {
          setFetchdata(response.data.officials);
          passToSuccessLogs(response.data, currentFileName);
          setReload(false);
        })
        .catch(error => {
          passToErrorLogs(`Officials not Fetched!  ${error}`, currentFileName);
          setReload(false);
        });
        setSearchTriggered(false);
    }
  }, [searchTriggered]);

  const handleDelete = async (id) => {
    Swal.fire({
      customClass: {
        title: 'alert-title',
        icon: 'alert-icon',
        confirmButton: 'alert-confirmButton',
        cancelButton: 'alert-cancelButton',
        container: 'alert-container',
        popup: 'alert-popup'
      },
      title: 'Delete Official?',
      text: "Are you sure you want to delete this data? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSearchTriggered(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.deleteOfficial, { params: { id }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                setSearchTriggered(true);
              })  
              .catch(error => {
                setSearchTriggered(true);
                toast.error("Cant delete official!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };

  return (
    <>
      {reload && <FixedLoading /> }
      <DashboardLayout>
        <DashboardNavbar RENDERNAV={rendering} />      
        {DATA && rendering == 2 ? 
            <Edit DATA={DATA} HandleRendering={HandleRendering} ReloadTable={ReloadTable} />       
          :
          rendering == 3 ?
            <Add HandleRendering={HandleRendering} ReloadTable={ReloadTable}  />
        :   
        <SoftBox p={2}>
            <SoftBox className="px-md-4 px-3 py-2" display="flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                    <SoftTypography className="text-uppercase text-secondary" variant="h6" >Barangay Officials</SoftTypography>
                </SoftBox>
                <SoftBox display="flex">
                    {access == 999 &&
                    <SoftButton onClick={() => setRendering(3)} className="ms-2 py-0 px-3 d-flex rounded-pill" variant="gradient" color="info" size="small" >
                      <Icon>add</Icon> Add Officials
                    </SoftButton>
                    }
                    
                </SoftBox>
            </SoftBox>
            <SoftBox mb={3} p={2} >
              
                {((fetchdata && fetchdata.officials) && !fetchdata.officials.length > 0 ) ?
                  <SoftTypography mt={0} color="dark" fontSize="0.8rem" className="text-center">
                      None for Today!
                  </SoftTypography> : " "
                }
                <Grid container spacing={3}>
                  {fetchdata && fetchdata.officials && 
                    fetchdata.officials.map((data) => (
                    <Grid item xs={12} md={6} key={data.id} className="p-3">
                      <SoftBox className=" bg-white shadow rounded p-3 py-4">
                      <SoftBox className="d-flex">
                        <img 
                              src={`data:image/*;base64,${data.id_picture}`}
                              alt={`${data.name}'s ID`} 
                              className="img-fluid rounded mt-2 border text-center m-auto" 
                              style={{ width: '150px',  height: '150px' }} // Adjust the size as needed
                        />
                      </SoftBox>
                      <SoftTypography mt={1} color="dark" fontSize="1rem" className="text-center fw-bold">
                         {data.name || ' '}
                      </SoftTypography>
                      <SoftTypography mt={0} color="info" fontSize="0.8rem" className="text-center fw-bold">
                         {data.position_name || ' '}
                      </SoftTypography>
                      <SoftTypography mt={0} color="dark" fontSize="0.8rem" className="text-center">
                         {data.biography || ' '}
                      </SoftTypography>
                      {access == 999 && role === "ADMIN" &&
                        <SoftBox mt={2} display="flex" justifyContent="center">
                        <SoftButton onClick={() => handleDelete(data.id)} className="text-xxs me-2 px-3 rounded-pill" size="small" variant="gradient" color="primary">
                          <DeleteTwoToneIcon /> delete
                        </SoftButton>
                        <SoftButton onClick={() => handleUpdate(data.id)} className="text-xxs me-2 px-3 rounded-pill" size="small" variant="gradient" color="dark">
                          <BorderColorTwoToneIcon /> edit
                        </SoftButton>
                      </SoftBox>
                      }
                      </SoftBox>
                    </Grid>
                  ))}                  
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

export default Officials;
