import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchdashboardListingData } from "../redux/slice/DashboardListingSlice";

const CardWithBarChart = ({ count }) => {
  const { DashboardListingData } = useSelector(
    (state) => state.DASHBOARDLISTING
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchdashboardListingData());
  }, [dispatch]);

  // Extracting the incident data from the Redux store
  const incidentchart = DashboardListingData?.data?.incidentchart || [];

  // Extracting the counts from the incident data
  const counts = incidentchart.map((incident) => incident.count);

  // Defining the series data for the bar chart with a single array of counts
  const seriesData = [
    {
      name: "Incidents",
      data: counts,
    },
  ];

  // Defining the options for the bar chart
  const options = {
    dataLabels: {
      enabled: false,
    },
    colors: ["#90EE90"], // Single color for all bars
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 2,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
        columnWidth: "50%",
      },
    },
    xaxis: {
      type: "",
      categories: [
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      min: 0,
      max: 250,
      tickAmount: 5,
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
    legend: {
      horizontalAlign: "right",
      offsetY: 40,
      marginBottom: 20,
    },
    grid: {
      borderDashArray: [4, 10],
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <Card className="h-100" style={{ border: "none" }}>
      <div style={{ padding: 15 }}>
        <div className="d-flex justify-content-between flex-wrap">
          <h3 style={{ fontWeight: "700", fontSize: "24px" }}>
            Number of Incidents
          </h3>
          <div className="indicators d-flex d-none">
            <p className="red_indictor">
              <span></span>Informed RIDDOR
            </p>
            <p className="yellow_indictor">
              <span></span>Went to Hospital
            </p>
            <p className="green_indictor">
              <span></span>Minor
            </p>
          </div>
        </div>
        <h2>{count > 0 ? count : "No Incidents Found"}</h2>
        <div id="chart">
          <ReactApexChart
            options={options}
            series={seriesData}
            type="bar"
            height={300}
            width={"100%"}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    </Card>
  );
};

export default CardWithBarChart;
