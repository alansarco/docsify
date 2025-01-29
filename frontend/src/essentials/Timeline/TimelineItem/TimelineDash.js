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

// Custom styles for the TimelineDash
import { timelineItem, timelineItemIcon } from "essentials/Timeline/TimelineItem/styles";

function TimelineDash({ color, icon, title, dateNeeded, dateRequested, badges, description, lastItem, task_status }) {
  const isDark = useTimeline();

  const renderBadges =
    badges.length > 0
      ? badges.map((badge, key) => {
          const badgeKey = `badge-${key}`;

          return (
            <SoftBox key={badgeKey} mr={key === badges.length - 1 ? 0 : 0.5}>
              <SoftBadge color={color} size="xs" badgeContent={badge} container />
            </SoftBox>
          );
        })
      : null;

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
      <SoftBox ml={5.75} pt={0.5} lineHeight={0} maxWidth="100%">
        <SoftTypography variant="button" fontWeight="medium" color={isDark ? "white" : "dark"}>
          {title}
        </SoftTypography>
        <SoftBox mt={1}>
          <SoftTypography
            variant="h6"
            className="text-xxs"
            color={isDark ? "secondary" : "text"}
          >
            <b className="text-dark">{description ? `Requested By: ` : " "}</b>
            {description}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={0}>
          <SoftTypography
            variant="h6"
            className="text-xxs"
            color={isDark ? "secondary" : "text"}
          >
            <b className="text-dark">{dateNeeded ? `Target Finish: ` : " "}</b>
            {dateNeeded}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={0}>
          <SoftTypography
            variant="h6"
            className="text-xxs"
            color={isDark ? "secondary" : "text"}
          >
            <b className="text-dark">{dateRequested ? `Date Requested: ` : " "}</b>
            {dateRequested}
          </SoftTypography>
        </SoftBox>
        {badges.length > 0 ? (
          <SoftBox mt={1} display="flex" pb={lastItem ? 1 : 2}>
            {renderBadges}
          </SoftBox>
        ) : null}
      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of TimelineDash
TimelineDash.defaultProps = {
  color: "info",
  badges: [],
  lastItem: false,
  description: "",
};

// Typechecking props for the TimelineDash
TimelineDash.propTypes = {
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
  dateNeeded: PropTypes.string.isRequired,
  description: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  lastItem: PropTypes.bool,
};

export default TimelineDash;
