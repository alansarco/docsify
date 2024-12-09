import { useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Bar } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// React essentials
import BarReportsChartItem from "essentials/Charts/BarCharts/ReportsBarChart/ReportsBarChartItem";
import AbsoluteLoading from "components/General/AbsoluteLoading";

// ReportsBarChart configurations
import configs from "essentials/Charts/BarCharts/ReportsBarChart/configs";

function ReportsBarChart({ color, title, description, chart, items, loading, nodata }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

  const renderItems = items.map(({ icon, label, progress }) => (
    <Grid item xs={6} sm={3} key={label}>
      <BarReportsChartItem
        color={color}
        icon={{ color: icon.color, component: icon.component }}
        label={label}
        progress={{ content: progress.content, percentage: progress.percentage }}
      />
    </Grid>
  ));

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox px={2} pt={2}>        
        <SoftBox px={1}>
          <SoftBox mb={0}>
            <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
              {title}
            </SoftTypography>
            <SoftTypography component="div" variant="button" color="text" fontWeight="regular">
              {description}
            </SoftTypography>
          </SoftBox>
          <SoftBox py={1} px={0.5}>
            <Grid container spacing={2}>
              {renderItems}
            </Grid>
          </SoftBox>
        </SoftBox>
        {useMemo(
          () => (
            <SoftBox
              variant="gradient"
              bgColor={color}
              borderRadius="lg"
              py={0}
              pr={0.5}
              mb={3}
              height="10rem"  
              display="flex"
            >
              {loading ? 
              <AbsoluteLoading /> 
              : !nodata ? 
                <Bar data={data} options={options} /> 
                : <SoftTypography className="text-sm m-auto text-white">No data to fetch</SoftTypography> }
            </SoftBox>
          ),
          [chart, color]
        )}
      </SoftBox>
    </Card>
  );
}

// Setting default values for the props of ReportsBarChart
ReportsBarChart.defaultProps = {
  color: "dark",
  description: "",
  items: [],
};

// Typechecking props for the ReportsBarChart
ReportsBarChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
};

export default ReportsBarChart;
