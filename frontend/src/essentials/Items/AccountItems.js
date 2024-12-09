import { forwardRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// custom styles for the AccountItems
import { menuItem, menuImage } from "essentials/Items/styles";

const AccountItems = forwardRef(({ color, image, title, description, ...rest }, ref) => (
  <MenuItem {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
    <SoftBox
      width="2.25rem"
      height="2.25rem"
      mt={0.25}
      mr={2}
      mb={0.25}
      borderRadius="lg"
      sx={(theme) => menuImage(theme, { color })}
    >
      {image}
    </SoftBox>
    <SoftBox>
      <SoftTypography variant="button" textTransform="capitalize" fontWeight="regular">
        <strong>{title[0]}</strong> {title[1]}
      </SoftTypography>
      <SoftTypography
        variant="caption"
        color="secondary"
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 0.5,
        }}
      >
        {description}
      </SoftTypography>
    </SoftBox>
  </MenuItem>
));

// Setting default values for the props of AccountItems
AccountItems.defaultProps = {
  color: "dark",
};

// Typechecking props for the AccountItems
AccountItems.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  image: PropTypes.node.isRequired,
  title: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AccountItems;
