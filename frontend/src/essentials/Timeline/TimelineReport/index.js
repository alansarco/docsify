// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Timeline context
import { useTimeline } from "essentials/Timeline/context";

// Custom styles for the TimelineItem
import { timelineItem, timelineItemIcon } from "essentials/Timeline/TimelineItem/styles";

function TimelineReport({ color, icon, title, dateTime, description, lastItem, reported, contact, location, priority, dateHappen, timeHappen }) {
  const isDark = useTimeline();

  return (
    <SoftBox position="relative" ml={2} sx={(theme) => timelineItem(theme, { lastItem })}>
      <SoftBox
        bgColor={isDark ? "dark" : "white"}
        width="1.625rem"
        height="1.625rem"
        borderRadius="50%"
        position="absolute"
        top="3.25%"
        left="2px"
        zIndex={2}
      >
        <Icon sx={(theme) => timelineItemIcon(theme, { color })}>{icon}</Icon>
      </SoftBox>
      <SoftBox ml={5.75} pt={description ? 0.7 : 0.5} lineHeight={0} maxWidth="100%">
        <SoftTypography variant="button" fontWeight="medium" color={isDark ? "white" : "dark"}>
          {title} -
        </SoftTypography>
        <SoftTypography variant="button" ml={1} color="secondary">
          {(location) || ' '}
        </SoftTypography>
        <SoftBadge badgeContent={priority} variant="gradient" 
          color={priority === "normal" ? 
            "info" : priority === "important" ? 
            "primary" : "error"} 
        />
        <SoftBox mt={0.5}>
          <SoftTypography
            variant="caption"
            fontWeight="medium"
            color={isDark ? "secondary" : "text"}
          >
            Date Reported: {dateTime}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={0.5}>
          <SoftTypography
            variant="caption"
            fontWeight="medium"
            color={isDark ? "secondary" : "text"}
          >
            Date Happened: {dateHappen} {timeHappen}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1.5}>
          {description ? (
            <SoftTypography variant="button" fontWeight="regular" color="text" className="fst-italic" >
              {description}
            </SoftTypography>
          ) : null}
        </SoftBox>
        <SoftTypography variant="button" color="primary" className="fst-italic text-capitalize">
          {reported || ' '} -
        </SoftTypography>
        <SoftTypography variant="button" ml={1}>
          {(contact) || ' '}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of TimelineItem
TimelineReport.defaultProps = {
  color: "info",
  lastItem: false,
  description: "",
};

// Typechecking props for the TimelineItem
TimelineReport.propTypes = {
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
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  description: PropTypes.string,
  lastItem: PropTypes.bool,
};

export default TimelineReport;
