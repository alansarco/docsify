// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// React examples
import PageLayout from "essentials/LayoutContainers/PageLayout";

function CoverLayout({ color, header, title, description, image, children }) {
  return (
    <PageLayout>
      <SoftBox className="d-flex px-4 py-4" height={{ xs: "100%", md: "100vh" }}>
        <Grid
          className="m-auto shadow-lg rounded"
          container
          maxWidth={{ xs: "100%", md: "800px" }}
          justifyContent="center"
        >
          {/* Left Side */}
          <Grid item xs={12} md={6} p={{ xs: 5, sm: 8 }} className="bg-lavender" >
            <SoftBox
              height={{ xs: "100%", md: "100%" }}
              display={{ xs: "flex", md: "flex" }}
            >
              <SoftBox className="m-auto d-flex">
              <img className="w-100 m-auto" src={image} alt="logo here" />
              </SoftBox>
            </SoftBox>
          </Grid>
          {/* Right Side */}
          <Grid item xs={12} md={6} className="bg-dark align-items-center" p={3}>
            <SoftBox>
              <SoftBox pt={2} px={3}>
                {!header ? (
                  <>
                    {/* <SoftBox mb={0}>
                      <SoftTypography  variant="h3" fontWeight="bold" className="text-white" >
                        {title}
                      </SoftTypography>
                    </SoftBox> */}
                    <SoftTypography pt={2} mb={0} variant="h5" fontWeight="bold" className="text-info" >
                      {description}
                    </SoftTypography>
                  </>
                ) : (
                  header
                )}
              </SoftBox>
              <SoftBox pt={0} px={3}>{children}</SoftBox>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </PageLayout>
  );
}

// Setting default values for the props of CoverLayout
CoverLayout.defaultProps = {
  header: "",
  title: "",
  description: "",
  color: "warning",
  top: 20,
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  top: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
