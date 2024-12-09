// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import AbsoluteLoading from "components/General/AbsoluteLoading";

// Timeline context
import { TimelineProvider } from "essentials/Timeline/context";

function TimelineList({ title, dark, children,  loading, shadow }) {
  return (
    <TimelineProvider value={dark} mb={2}>
      <Card className={shadow} >
        <SoftBox bgColor={dark ? "dark" : "white"} variant="gradient" minHeight="15rem">
          <SoftBox pt={3} px={3}>
            <SoftTypography mb={0} variant="h6" fontWeight="medium" color={dark ? "white" : "dark"}>
              {title}
            </SoftTypography>
          </SoftBox>
            {loading ? <AbsoluteLoading /> : <SoftBox p={2}>{children}</SoftBox>}
        </SoftBox>
      </Card>
    </TimelineProvider>
  );
}

// Setting default values for the props of TimelineList
TimelineList.defaultProps = {
  dark: false,
};

// Typechecking props for the TimelineList
TimelineList.propTypes = {
  title: PropTypes.string.isRequired,
  dark: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default TimelineList;
