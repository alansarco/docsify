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
import { getStatus } from "components/General/Utils";
import SoftBadge from "components/SoftBadge";
import { getStatusColor } from "components/General/Utils";

function Table({ DATA, tablehead, HandleDATA, HandleRendering }) {
  const { light, secondary } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;
  const handleSubmit = (row) => {
    HandleDATA(row.reference_no);
    HandleRendering(2);
  }

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

  const renderRows = DATA.map((row) => {
    return (
      <TableRow key={row.reference_no}>
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
            {row.reference_no}
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
            {row.doc_name}    
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.task_owner_name}    
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
            {/* <SoftTypography color={row.status == "1" ? "info" : "primary"} sx={{ fontSize: "1rem" }}>{row.status == "1" ? <CheckIcon /> : "x"}</SoftTypography> */}
            {row.status &&
              <SoftBadge 
              badgeContent={getStatus(row.status)} 
              variant="gradient" 
              color={getStatusColor(row.status)} 
              size="sm" />
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
  );
}

export default Table;
