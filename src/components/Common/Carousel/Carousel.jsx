import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { format } from "date-fns";
import "./Carousel.css"; // Import CSS for styling

const HorizontalMonthSlider = ({ months, setradialBardata }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(4); // Initially set to May (index 4)
  const numVisibleMonths = 5; // Number of visible months in the slider

  const handleSlide = (direction) => {
    if (direction === "next") {
      setCurrentMonthIndex((prevIndex) =>
        Math.min(prevIndex + 1, months.length - 1)
      );
    } else if (direction === "prev") {
      setCurrentMonthIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  useEffect(() => {
    setCurrentMonthIndex(Math.max(months.length / 2 - Math.floor(numVisibleMonths / 2), 0));
  }, []);

  const startIdx = Math.max(currentMonthIndex - Math.floor(numVisibleMonths / 2), 0);
  const endIdx = Math.min(startIdx + numVisibleMonths, months.length);

  return (
    <div className="horizontal-month-slider">
      <div className="months-container">
        <div className="button-container left" onClick={() => handleSlide("prev")}>
          <FaChevronLeft />
        </div>
        <div className="slider" style={{ transform: `translateX(-${startIdx * 110}px)` }}>
          {months?.map((item, index) => (
            <div
              key={index}
              className={`month ${index === currentMonthIndex ? "current-month" : ""}`}
              onClick={() => {
                setCurrentMonthIndex(index);
                const formattedPercentageChange = item.percentageChange.toFixed(); // Format to three digits after the decimal

                setradialBardata((prev) => ({
                  ...prev,
                  series: [item.value],
                  options: {
                    ...prev?.options,
                    labels: [`${item?.percentageChange}%`],
                    plotOptions: {
                      ...prev?.plotOptions,
                      radialBar: {
                        ...prev?.radialBar,
                        dataLabels: {
                          ...prev.dataLabels,
                          name: {
                            ...prev.name,
                            color:
                              item?.percentageChange > 0
                                ? "#00FF00"
                                : item?.percentageChange < 0
                                ? "#FF0000"
                                : "grey", // Grey color if percentageChange is 0
                          },
                        },
                      },
                    },
                  },
                }));
              }}
            >
              {item.month}
            </div>
          ))}
        </div>
        <div className="button-container right" onClick={() => handleSlide("next")}>
          <FaChevronRight />
        </div>
      </div>
    </div>
  );
};

export default HorizontalMonthSlider;
