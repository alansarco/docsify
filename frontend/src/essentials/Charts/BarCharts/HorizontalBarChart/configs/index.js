// React base styles
import typography from "assets/theme/base/typography";

function configs(labels, datasets) {
  return {
    data: {
      labels,
      tension: 0.4,
      borderWidth: 0,
      borderRadius: 4,
      borderSkipped: false,
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
      },
      scales: {
        y: {
          precision: 0,
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },  
          ticks: {
            display: true,
            padding: 10,
            color: "#9ca2b7",
            font: {
              size: 11,   
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 1,
            },
          },
        },
        x: {
          precision: 0,
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: true,
            drawTicks: true,
          },
          ticks: {
            display: true,
            color: "#9ca2b7",
            padding: 5,
            font: {
              size: 11,
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 1,
            },
          },
        },
      },
    },
  };
}

export default configs;
