import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = () => {
  // Sample data for the bar chart
  const chartData = [
    {
      name: 'Series 1',
      data: [3000, 50000, 10000, 30000, 20000, 40000, 15000]
    }
  ];

  // Options for the bar chart
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
   
        bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 7 // Add border radius to bars
         
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: false,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      labels: {
        show: false // Hide x-axis labels
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val / 1000 + "k";
        }
      },
      title: {
        // text: 'Count'
      },
      tickAmount: 5, 
      min: 0 
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " units";
        }
      }
    }
  };

  return (
    <div className="bar-chart">
      <ReactApexChart options={chartOptions} series={chartData} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
