// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// React base styles
import colors from "assets/theme/base/colors";

function UserIcon({ color, size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size}
    height={size}   viewBox="0 0 640 512">
      <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM625 177L497 305c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L591 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
  );
}

// Setting default values for the props of CustomerSupport
UserIcon.defaultProps = {
  color: "dark",
  size: "16px",
};

// Typechecking props for the CustomerSupport
UserIcon.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
    "white",
  ]),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default UserIcon;
