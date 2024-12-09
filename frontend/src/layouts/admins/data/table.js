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

function Table({ admins, tablehead, HandleUSER, HandleRendering }) {
  const { light, secondary } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;
  const handleSubmit = (row) => {
    HandleUSER(row.username);
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

  const renderRows = admins.map((row) => {
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
                letterSpacing: "1px"        
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
            {row.name}
          </SoftBox>      
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.gender}    
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.contact}    
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            textAlign="center"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            <SoftTypography color={row.account_status == "1" ? "info" : "primary"} sx={{ fontSize: "1rem" }}>{row.account_status == "1" ? <CheckIcon /> : "x"}</SoftTypography>
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.last_online}    
          </SoftBox>  
        </TableRow>
    )});

  return (  
      <TableContainer className="shadow-none bg-gray p-3">
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
