

import { useRef, useEffect, useState, useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// React helper functions
import gradientChartLine from "assets/theme/functions/gradientChartLine";

// RequestAnalyticsChart configurations
import RequestConfig from "essentials/Charts/LineCharts/GradientLineChart/configs/RequestConfig";

// React base styles
import colors from "assets/theme/base/colors";
import AbsoluteLoading from "components/General/AbsoluteLoading";
import { formatCurrency } from "components/General/Utils";
import { Grid } from "@mui/material";

function RequestAnalyticsChart({ title, description, height, chart, loading, currentdata, totaldata, gradeselection, timeselection }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const { data, options } = chartData;

  useEffect(() => {
    const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => ({
          ...dataset,
          tension: 0.25,
          pointRadius: 0,
          borderWidth: 3,
          borderColor: colors[dataset.color]
            ? colors[dataset.color || "dark"].main
            : colors.dark.main,
          fill: true,
          maxBarThickness: 6,
          backgroundColor: gradientChartLine(
            chartRef.current.children[0],
            colors[dataset.color] ? colors[dataset.color || "dark"].main : colors.dark.main
          ),
        // backgroundColor: "#00000000"
        }))
      : [];

    setChartData(RequestConfig(chart.labels || [], chartDatasets));
  }, [chart]);

  const renderChart = (
    <SoftBox p={2}>
      {loading && <AbsoluteLoading /> }
      {title || description ? (
        <SoftBox px={description ? 1 : 0} pt={description ? 1 : 0}>
          {title && (
            <SoftBox mb={1}>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={6}>
                        <SoftTypography variant="h6">{title} <span className="text-info text-gradient">({currentdata} request/s)</span></SoftTypography>
                        <SoftTypography variant="h6" className="text-xxs">Total Requests 
                            <span className="text-success text-gradient"> ({totaldata} request/s)</span>
                        </SoftTypography>
                    </Grid>
                    <Grid item xs={12} md={6} display="flex" justifyContent="end" alignItems="end">
                        {gradeselection}
                        {timeselection}
                    </Grid>
                </Grid>
            </SoftBox>
            
          )}
          <SoftBox mb={2}>
            <SoftTypography component="div" variant="button" fontWeight="regular" color="text">
              {description ? description : " "}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      ) : null}   
      {useMemo( 
        () => ( 
          <SoftBox>
            <SoftBox ref={chartRef} md={{ height }}>  
              <Line data={data} options={options}/>
            </SoftBox>
          </SoftBox>
          
        ),
        [chartData, height]
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of RequestAnalyticsChart
RequestAnalyticsChart.defaultProps = {
  title: "",
  description: "",
  height: "19.125rem",
};

// Typechecking props for the RequestAnalyticsChart
RequestAnalyticsChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default RequestAnalyticsChart;
