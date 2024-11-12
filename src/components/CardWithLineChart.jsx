import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const CardWithLineChart = () => {
  const { DashboardListingData } = useSelector(
    (state) => state.DASHBOARDLISTING
  );

  const [data, setData] = useState({
    series: [
      {
        name: "Total Kits",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  });

  useEffect(() => {
    let data = Array(12).fill(0); 

    // Update count for the corresponding month based on _id
    DashboardListingData?.data?.registeredKitchart?.forEach((item) => {
      if (item._id >= 1 && item._id <= 12) {
        data[item._id - 1] = item.count;
      }
    });

    setData((prev) => ({
      ...prev,
      series: [
        {
          name: "Registered Kits",
          data: data,
        },
      ],
    }));
  }, [DashboardListingData]);

  return (
    <Card className="p-3" style={{ border: "none" }}>
      <Card.Title style={{ fontSize: 24, fontWeight: "700" }}>
        Registered Kits
        <div id="chart">
          <ReactApexChart
            options={data.options}
            series={data.series}
            type="area"
            height={350}
          />
          <div id="html-dist" />
        </div>
      </Card.Title>
    </Card>
  );
};

export default CardWithLineChart;
