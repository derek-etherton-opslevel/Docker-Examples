import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ events, selectedDate, onDateClick, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = new Date(event.startDate).toISOString().split('T')[0];
      const eventEnd = new Date(event.endDate).toISOString().split('T')[0];
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateClick(today);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="nav-button">‹</button>
        <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
        <button onClick={goToNextMonth} className="nav-button">›</button>
        <button onClick={goToToday} className="today-button">Today</button>
      </div>
      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          return (
            <div
              key={index}
              className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
              onClick={() => date && onDateClick(date)}
            >
              {date && (
                <>
                  <div className="day-number">{date.getDate()}</div>
                  <div className="day-events">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event._id}
                        className="event-dot"
                        style={{ backgroundColor: event.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        title={event.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="more-events">+{dayEvents.length - 3}</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
