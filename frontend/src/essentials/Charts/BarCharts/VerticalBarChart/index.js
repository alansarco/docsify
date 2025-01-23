import { useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Bar } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import AbsoluteLoading from "components/General/AbsoluteLoading";

// VerticalBarChart configurations
import configs from "essentials/Charts/BarCharts/VerticalBarChart/configs";

// React base styles
import colors from "assets/theme/base/colors";

function VerticalBarChart({ title, description, height, chart, nodata, loading, maxCount }) {
  const predefinedColors = [
    '#FF6384', // Color for the first dataset
    '#36A2EB', // Color for the second dataset
    '#FFCE56', // Color for the third dataset
    '#4BC0C0', // Color for the fourth dataset
    '#9966FF', // Color for the fifth dataset
    '#FF9F40', // Color for the sixth dataset
    '#B0BEC5', // Light blue-gray
    '#CFD8DC', // Light gray
    '#90A4AE', // Blue-gray
    '#78909C', // Blue-gray
    '#455A64', // Dark blue-gray
    '#BDBDBD', // Gray
    '#E0E0E0', // Light gray
    '#F5F5F5', // Very light gray
    '#F0E68C', // Khaki
    '#D7CCC8', // Beige
    '#BCAAA4', // Brownish-gray
    '#A1887F', // Light brown
    '#8D6E63', // Medium brown
    '#7B5B5D', // Muted red-brown
    '#5D4037', // Dark brown
    '#C5E1A5', // Light green
    '#B9FBC0', // Mint green
    '#AED581', // Light olive green
    '#DCE775', // Lime green
    '#FFEB3B', // Yellow
    '#FFF176', // Light yellow
    '#FFF59D', // Very light yellow
    '#FFCC80', // Light orange
    '#FFAB91', // Light coral
    '#FF8A65', // Coral
    '#FF5722', // Deep orange
    '#FF6F00', // Dark yellow-orange
    '#FFCA28', // Light gold
    '#FFC107', // Amber
    '#FFD54F', // Golden yellow
    '#FFB300', // Bright orange
    '#FFC107', // Amber
    '#B2DFDB', // Light teal
    '#B3E5FC', // Light sky blue
    '#BBDEFB', // Very light blue
    '#64B5F6', // Sky blue
    '#42A5F5', // Bright blue
    '#2196F3', // Blue
    '#1976D2', // Dark blue
    '#1565C0', // Very dark blue
    '#0D47A1', // Deep blue
    '#D1C4E9', // Light lavender
    '#E1BEE7', // Light purple
    '#F8BBD0', // Light pink
    '#F06292', // Pink
    '#EC407A', // Medium pink
    '#D81B60', // Deep pink
    '#880E4F', // Dark pink
    '#4A148C', // Dark purple
    '#311B92', // Dark indigo
    '#1A237E', // Dark blue
  ];

  const chartDatasets = chart.datasets
    ? chart.datasets.map((dataset, index) => ({
        ...dataset,
        weight: 15,
        borderWidth: 0,
        // borderRadius: 5,  
       backgroundColor: Object.values(predefinedColors),
        fill: false,
        maxBarThickness: 20, 
        // borderSkipped: 'start'
        // borderSkipped: {
        //   top: 5,    // Radius for the top
        //   bottom: 5, // Radius for the bottom
        // },
      }))
    : [];

  const { data, options } = configs(chart.labels || [], chartDatasets, maxCount);
  const renderChart = (
    <SoftBox p={2}>
      {title || description ? (
        <SoftBox px={description ? 1 : 0} pt={description ? 1 : 0}>
          {title && (
            <SoftBox mb={0}>
              <SoftTypography variant="h6" className="">{title}</SoftTypography>
              <SoftBox display="flex" justifyContent="end">
                <SoftTypography color="info" className="text-center text-xs">
                  Total:
                  <b className="text-dark"> {maxCount || 0}</b>
                </SoftTypography>
              </SoftBox>
              
            </SoftBox>
          )}
          <SoftBox mb={0}>
            <SoftTypography component="div" variant="button" fontWeight="regular" color="white">
              {description}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      ) : null}
      {useMemo(
        () => (
          <SoftBox display="flex" height={height}>
            {loading ? 
              <AbsoluteLoading /> 
              : !nodata ? 
                <Bar data={data} options={options} /> 
                : <SoftTypography className="text-xs m-auto text-secondary">No data to display</SoftTypography> }
          </SoftBox>
        ),
        [chart, height]
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of VerticalBarChart
VerticalBarChart.defaultProps = {
  title: "",
  description: "",
  height: "25rem",
};

// Typechecking props for the VerticalBarChart
VerticalBarChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default VerticalBarChart;
