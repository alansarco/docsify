// React base styles
import typography from "assets/theme/base/typography";
import { getNumber } from "components/General/Utils";

function configs(labels, datasets, maxCount) {
  return {
    data: {
      labels,
      tension: 0.4,
      borderWidth: 0,
      maxBarThickness: 6,
      datasets: [...datasets],
    },
    options: {
      indexAxis: "x",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#344767',  // This will make the numbers white
          anchor: 'end',
          align: 'end',
          font: {
            size: 12,  // Adjust this size if needed
            family: typography.fontFamily,
            style: "normal",
            weight: 'bold',
            lineHeight: 1,
          }
        }
      },
      scales: {
        y: {
          title: {
            display: false,
            text: 'STATUS',
            font: {
              size: 10,
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
              size: 10,   
              family: typography.fontFamily,
              lineHeight: 1,
            },
          },
          max: Math.floor(maxCount),
        },
        x: {
          title: {
            display: false,
            text: 'COUNT',
            font: {
              size: 10,
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
          max: Math.floor(maxCount), // or use suggestedMax for a softer limit
        },
      },
    },
  };
}

export default configs;
