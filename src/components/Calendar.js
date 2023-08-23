// components/Calendar.js
import React from 'react';

function Calendar({ selectedDates, color }) {
  return (
    <div className={`calendar ${color}`}>
      {selectedDates.map((date, index) => (
        <div key={index} className="day">
          {date}
        </div>
      ))}
    </div>
  );
}

export default Calendar;
