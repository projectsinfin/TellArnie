// DropdownCalendar.js

import React, { useState } from "react";

const DropdownCalendar = ({ value, onDateChange }) => {
  const currentYear = new Date().getFullYear();
  const [date, setDate] = useState({
    // year: currentYear,
    year:"",
    month: "",
    day: "",
  });

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setDate((prev) => ({ ...prev, month }));
    onDateChange({ ...date, month });
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setDate((prev) => ({ ...prev, year }));
    onDateChange({ ...date, year });
  };

  const generateYearOptions = (start, end) => {
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year);
    }
    return years;
  };

  const months = [
    { value: "january", name: "January" },
    { value: "february", name: "February" },
    { value: "march", name: "March" },
    { value: "april", name: "April" },
    { value: "may", name: "May" },
    { value: "june", name: "June" },
    { value: "july", name: "July" },
    { value: "august", name: "August" },
    { value: "september", name: "September" },
    { value: "october", name: "October" },
    { value: "november", name: "November" },
    { value: "december", name: "December" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <select
        value={date.month}
        onChange={handleMonthChange}
        style={{
          marginRight: "5px", 
          padding: "8px 2px", 
          fontSize: "13px", 
        }}
      >
        <option value="">MM</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.name}
          </option>
        ))}
      </select>
      <select
        value={date.year}
        onChange={handleYearChange}
        style={{
          marginRight: "0px", 
          padding: "8px 2px", 
          fontSize: "13px", 
        }}
      >
        <option value="">YY</option>
        {generateYearOptions(2024, 2050).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownCalendar;
