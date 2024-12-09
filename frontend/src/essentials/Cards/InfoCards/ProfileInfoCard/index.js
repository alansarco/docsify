// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function ProfileInfoCard({ title, info }) {
  const labels = [];
  const values = [];

  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(info).forEach((el) => {
    // Replace underscores with spaces and handle camelCase keys
    let newElement = el.replace(/_/g, " "); // Replace underscores with spaces
    
    if (newElement.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(newElement).find((i) => i.match(/[A-Z]+/));
      newElement = newElement.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
    }
  
    labels.push(newElement);
  });  

  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <SoftBox key={label} display="flex" pt={1} pr={2}>
      <SoftTypography variant="button" fontWeight="bold" textTransform="capitalize" className="text-xs">
        {label}: &nbsp;
      </SoftTypography>
      <SoftTypography variant="button" fontWeight="regular" color="text" className="text-xs">
        &nbsp;{values[key]} 
      </SoftTypography>
    </SoftBox>
  ));

  return (
    <SoftBox sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={0} px={0}>
        <SoftTypography fontWeight="medium" color="info" textGradient>
          {title}
        </SoftTypography>
      </SoftBox>
      <SoftBox p={0}>
        <SoftBox>
          {renderItems}
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default ProfileInfoCard;
