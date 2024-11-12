import * as React from 'react';
import dayjs from 'dayjs';
import "./style.css"
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';

const YearMonthCalendar = ({ value, onChange }) => {
  const [selectedYear, setSelectedYear] = React.useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = React.useState(dayjs().month());

  const handleYearChange = (year) => {
    setSelectedYear(year.year());
    handleDateChange(year.year(), selectedMonth);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month.month());
    handleDateChange(selectedYear, month.month());
  };

  const handleDateChange = (year, month) => {
    const newDate = dayjs().year(year).month(month);
    onChange(newDate.format('YYYY-MM-DD'));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['YearCalendar', 'MonthCalendar']}>
        <DemoItem label="">
          <div className='date_picker'>
            <YearCalendar
              className='year_section'
              value={dayjs().year(selectedYear)}
              onChange={(year) => handleYearChange(year)}
            />
            <MonthCalendar
              className='month_section'
              value={dayjs().month(selectedMonth)}
              onChange={(month) => handleMonthChange(month)}
            />
          </div>
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default YearMonthCalendar;
