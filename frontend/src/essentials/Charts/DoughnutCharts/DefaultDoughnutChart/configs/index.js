/* eslint-disable no-dupe-keys */
// React base styles
import colors from "assets/theme/base/colors";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

const { gradients, dark } = colors;

function configs(labels, datasets) {
  const backgroundColors = [];

  if (datasets.backgroundColors) {
    datasets.backgroundColors.forEach((color) =>
      gradients[color]
        ? backgroundColors.push(gradients[color].state)
        : backgroundColors.push(dark.main)
    );
  } else {
    backgroundColors.push(dark.main);
  }

  // Filter the datasets and labels together to maintain correct index alignment
  const filteredData = datasets.data.filter((value) => value > 0);
  const filteredLabels = labels.filter((label, index) => datasets.data[index] > 0);

  return {
    data: {
      labels: filteredLabels,  // Use filtered labels
      datasets: [
        {
          label: datasets.label,
          weight: 23,
          cutout: 0,
          pointRadius: 2,
          // borderWidth: 3,
          backgroundColor: backgroundColors.slice(0, filteredData.length),  // Adjust background colors to match filtered data
          fill: false,
          data: filteredData,  // Use filtered data
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, // Ensure the legend is displayed
          position: "left", // Set legend position to "left"
          labels: {
            boxWidth: 15, // Width of the legend box
            filter: function (legendItem, chartData) {
              // Only display legend items with a value greater than 0
              return chartData.datasets[0].data[legendItem.index] > 0;
            },
          },
        },
        // Add data labels plugin for displaying counts directly on the chart
        datalabels: {
          display: true,
          color: 'white', // Text color for the data labels
          font: {
            weight: 'bold',
            size: 16,
          },
          formatter: (value) => value, // Display the raw value (count)
        },
        tooltip: {
          enabled: false, // Disable tooltips since counts will be displayed directly
        },
      },
      interaction: {
        intersect: false, // Tooltip will appear for the nearest point
        mode: "index", // Tooltip mode
      },
    },
    plugins: [ChartDataLabels], // Register the data labels plugin
  };
}

export default configs;
