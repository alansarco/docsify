// @mui material components
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import CheckIcon from '@mui/icons-material/Check';
// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";
import SoftBadge from "components/SoftBadge";
import DeleteIcon from '@mui/icons-material/Delete';
import SoftButton from "components/SoftButton";
import { useStateContext } from "context/ContextProvider";
import { useState } from "react";
import { passToSuccessLogs } from "components/Api/Gateway";
import { passToErrorLogs } from "components/Api/Gateway";
import { toast } from "react-toastify";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import FixedLoading from "components/General/FixedLoading"; 

function Table({ users, tablehead, HandleUSER, HandleRendering, ReloadTable }) {
  const currentFileName = "layouts/transferees/data/table.js";
  const { light, secondary } = colors;
  const {token, clientprovider} = useStateContext();
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;
  const [searchTriggered, setSearchTriggered] = useState(false);
  console.log('clientprovider. ',clientprovider)
    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
      'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };

  const handleSubmit = (row) => {
    HandleUSER(row.username);
    HandleRendering(2);
  }

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
      title: 'Cancel Request?',
      text: "Are you sure you want to cancel this? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSearchTriggered(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.deleteTransferRequest, { params: { id }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                  ReloadTable()
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                setSearchTriggered(false);
              })  
              .catch(error => {
                setSearchTriggered(false);
                toast.error("Cant cancel request!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };

  const handleReject = async (id) => {
    Swal.fire({
      customClass: {
        title: 'alert-title',
        icon: 'alert-icon',
        confirmButton: 'alert-confirmButton',
        cancelButton: 'alert-cancelButton',
        container: 'alert-container',
        popup: 'alert-popup'
      },
      title: 'Reject Request?',
      text: "Are you sure you want to reject this? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSearchTriggered(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.rejectTransferRequest, { params: { id }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                  ReloadTable()
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                setSearchTriggered(false);
              })  
              .catch(error => {
                setSearchTriggered(false);
                toast.error("Cant reject request!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };

  const handleApprove = async (id) => {
    Swal.fire({
      customClass: {
        title: 'alert-title',
        icon: 'alert-icon',
        confirmButton: 'alert-confirmButton',
        cancelButton: 'alert-cancelButton',
        container: 'alert-container',
        popup: 'alert-popup'
      },
      title: 'Approve Request?',
      text: "Are you sure you want to approve this? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSearchTriggered(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.approveTransferRequest, { params: { id }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                  ReloadTable()
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                setSearchTriggered(false);
              })  
              .catch(error => {
                setSearchTriggered(false);
                toast.error("Cant reject request!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };
  
  const renderColumns = tablehead.map((head , key) => {
    return (
      <SoftBox
        className={head.padding}
        component="th"
        key={key}
        pt={1.5}
        pb={1.25}
        textAlign={head.align}
        fontSize={size.xxs}
        fontWeight={fontWeightBold}
        color="secondary"
        >
        {head.name.toUpperCase()}
      </SoftBox>
    );
  });

  const renderRows = users.map((row) => {
    return (
      <TableRow key={row.username}>
          <SoftBox
            className="pe-2 text-decoration-underline cursor-pointer fw-bold"
            component="td"
            fontSize={size.xs}
            onClick={() => handleSubmit(row)}
            color="dark"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
            sx={{
              "&:hover ": {
                color: "#006eff"        
              },
            }}  
          >
            {row.username}
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.fullname}
          </SoftBox>      
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.client_from}
          </SoftBox>      
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.client_to}    
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.created_by}    
          </SoftBox>  
          <SoftBox
            className="px-2"
            textAlign="center"
            component="td"
            fontSize={size.xs}
            color="info"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`} 
          >
            {row.status >= 0 &&
              <SoftBadge 
              badgeContent={row.status == 1 ? 'approved' : row.status == 2 ? 'rejected' : 'pending'} 
              variant="gradient" 
              color={row.status == 1 ? 'dark' : row.status == 2 ? 'primary' : 'warning'} 
              size="sm" />
            }
          </SoftBox>   
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="info"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`} 
          >
            {row.school_from === clientprovider && row.status == 0 &&
              <SoftButton onClick={() => handleDelete(row.id)} className="text-xxs rounded-pill px-3 ms-1" variant="gradient" color="secondary" size="small">
                cancel
              </SoftButton>
            }
            {row.school_to == clientprovider && row.status == 0 &&
            <>
              <SoftButton onClick={() => handleReject(row.id)} className="text-xxs rounded-pill px-3 ms-1" variant="gradient" color="primary" size="small">
                reject
              </SoftButton>
              <SoftButton onClick={() => handleApprove(row.id)} className="text-xxs rounded-pill px-3 ms-1" variant="gradient" color="dark" size="small">
                approve
              </SoftButton>
            </>
            }
          </SoftBox>   
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.date_added}    
          </SoftBox>  
        </TableRow>
    )});

  return (  
    <>
      {searchTriggered && <FixedLoading /> }
      <TableContainer className="shadow-none  p-3">
        <MuiTable className="table table-sm table-hover table-responsive">  
          <SoftBox component="thead">
            <TableRow>{renderColumns}</TableRow>  
          </SoftBox>  
          <TableBody component="tbody">
            {renderRows}  
          </TableBody>
        </MuiTable> 
      </TableContainer>
    </>
  );
}

export default Table;
