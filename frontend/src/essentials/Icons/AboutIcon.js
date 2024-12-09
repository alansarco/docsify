// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// React base styles
import colors from "assets/theme/base/colors";

function AboutIcon({ color, size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
    width={size}
    height={size}    
    viewBox="0 0 512 512">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
  );
}

// Setting default values for the props of CreditCard
AboutIcon.defaultProps = {
  color: "dark",
  size: "16px",
};

// Typechecking props for the CreditCard
AboutIcon.propTypes = {
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

export default AboutIcon;
