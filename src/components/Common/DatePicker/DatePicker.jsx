import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";
function DateTimePicker() {
  const [startDate, setStartDate] = useState();
  return (
    <div className="date-picker-container">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        showTimeSelect
        showTimeInput
        placeholderText="Select Date and Time" // Add your placeholder text here
        // dateFormat="MMMM d, yyyy h:mm aa"
        className="custom-datepicker" // Add a custom class for styling
      />
    </div>
  );
}
export default DateTimePicker;
