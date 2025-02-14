// @mui material components
import { Icon, Table as MuiTable } from "@mui/material";
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
import SoftButton from "components/SoftButton";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import { useStateContext } from "context/ContextProvider";
import FixedLoading from "components/General/FixedLoading"; 
import { useState } from "react";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { passToErrorLogs } from "components/Api/Gateway";
import { passToSuccessLogs } from "components/Api/Gateway";
import { toast } from "react-toastify";
import DownloadButton from "components/General/DownloadButton";

function Table({ DATA, tablehead, ReloadTable  }) {
  const { light, secondary } = colors;
  const currentFileName = "layouts/students-storage/data/table.js";
  const {token} = useStateContext();
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;
  const [searchTriggered, setSearchTriggered] = useState(false);

  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const handleDelete = async (id) => {
    console.log(id);
    Swal.fire({
      customClass: {
        title: 'alert-title',
        icon: 'alert-icon',
        confirmButton: 'alert-confirmButton',
        cancelButton: 'alert-cancelButton',
        container: 'alert-container',
        popup: 'alert-popup'
      },
      title: 'Delete File?',
      text: "Are you sure you want to delete this? You won't be able to revert this!",
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
            axios.get(apiRoutes.deleteStorageData, { params: { id }, headers })
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
                toast.error("Cant delete file!", { autoClose: true });
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

  const renderRows = DATA.map((row, index) => {
    return (
      <TableRow key={row.id}>
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {index+1}
          </SoftBox>      
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.file_name}
          </SoftBox>      
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.file_type}
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
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            textAlign="center"
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            <SoftButton onClick={() => handleDelete(row.id)} className="text-xxs rounded-pill p-0 ms-1" variant="gradient" color="primary" size="small" iconOnly>
             <DeleteTwoToneIcon />
            </SoftButton>
             <DownloadButton fileid={row.id} fileName={row.file_name} setSearchTriggered={setSearchTriggered}/>
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
