// React base styles
import typography from "assets/theme/base/typography";

function RegistrarConfig(labels, datasets) {
  return {
    data: {
      labels,
      datasets: [
        ...datasets.map(dataset => ({
          ...dataset,
          pointRadius: 3, // Sets the size of the circle at each point
          pointBackgroundColor: "transparent",
          pointStyle: "circle", // Sets the style to a circle
          showLine: true, // Ensures the line is drawn through the points
        })),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false, // Hides data labels on points
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'NO OF REGISTRARS',
            font: {
              size: 14,
              family: typography.fontFamily,
              weight: 'bold',
            },
            color: '#344767',
          },
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },  
          ticks: {
            precision: 0,
            display: true,
            padding: 10,
            color: "#9ca2b7",
            font: {
              size: 12,   
              family: typography.fontFamily,
              lineHeight: 1,
            },
          },
        },
        x: {
          title: {
            display: false,
            text: 'DATE RANGE',
            font: {
              size: 14,
              family: typography.fontFamily,
              weight: 'bold',
            },
            color: '#344767',
          },
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: true,
            drawTicks: true,
          },
          ticks: {
            display: true,
            color: "#9ca2b7",
            padding: 10,
            font: {
              size: 10,
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 1,
            },
          },
          // Add this section to set the maximum value for the x-axis (Votes)
        },
      },
    },
  };
}


export default RegistrarConfig;
