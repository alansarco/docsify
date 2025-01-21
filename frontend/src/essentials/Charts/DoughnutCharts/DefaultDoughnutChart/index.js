import { useMemo } from "react";
import PropTypes from "prop-types";
import { Doughnut, Chart } from "react-chartjs-2";

import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import configs from "essentials/Charts/DoughnutCharts/DefaultDoughnutChart/configs";
import AbsoluteLoading from "components/General/AbsoluteLoading";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

// Register the plugin
Chart.register(ChartDataLabels);

function DefaultDoughnutChart({ title, description, height, chart, loading, nodata }) {
  const { data, options, cutout } = configs(chart.labels || [], chart.datasets || {}, chart.cutout);

  const renderChart = (
    <SoftBox p={2}>
      {title || description ? (
        <SoftBox px={description ? 1 : 0} pt={description ? 1 : 0}>
          {title && (
            <SoftBox mb={1}>
              <SoftTypography className="text-left" variant="h6">{title}</SoftTypography> 
            </SoftBox>
          )}

          {useMemo(() => (
            <SoftBox >
              {loading ? 
                <AbsoluteLoading /> 
                : !nodata ? 
                  <Doughnut data={data} options={options} cutout={cutout} />
                  : <SoftTypography className="text-sm m-auto">No data to fetch</SoftTypography>}
            </SoftBox>
          ), [chart, height])}
        </SoftBox>
      ) : null}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of DefaultDoughnutChart
DefaultDoughnutChart.defaultProps = {
  title: "",
  description: "",
  height: "auto",
};

// Typechecking props for the DefaultDoughnutChart
DefaultDoughnutChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
};

export default DefaultDoughnutChart;
