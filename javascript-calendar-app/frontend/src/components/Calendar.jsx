/**
 * Calendar Component
 *
 * A comprehensive calendar display component that shows a monthly view with events.
 * Users can navigate between months, view events on specific days, and interact
 * with dates and events.
 *
 * Features:
 * - Monthly calendar grid display
 * - Event visualization as colored dots on dates
 * - Navigation between months
 * - Quick "Today" button to return to current date
 * - Visual indicators for today and selected dates
 * - Click handlers for dates and events
 *
 * Props:
 * @param {Array} events - Array of event objects to display
 * @param {Date} selectedDate - Currently selected date
 * @param {Function} onDateClick - Callback when a date is clicked
 * @param {Function} onEventClick - Callback when an event dot is clicked
 */

import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ events, selectedDate, onDateClick, onEventClick }) => {
  // Track the currently displayed month (can be different from selectedDate)
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Month names for display in the calendar header
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Abbreviated day names for column headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /**
   * Generates an array of dates for the calendar grid
   *
   * Creates an array containing all dates to be displayed in the calendar grid,
   * including null values for empty cells before the first day of the month.
   * This ensures the calendar grid aligns properly with day-of-week headers.
   *
   * @param {Date} date - The date representing the month to display
   * @returns {Array<Date|null>} Array of Date objects and null values for empty cells
   */
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells (null values) for days before the first day of the month
    // This ensures the first day appears in the correct column
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month as Date objects
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  /**
   * Filters events that occur on a specific date
   *
   * Returns all events that overlap with the given date, including:
   * - Events that start on this date
   * - Events that end on this date
   * - Multi-day events that span this date
   *
   * @param {Date|null} date - The date to check for events
   * @returns {Array} Array of event objects occurring on this date
   */
  const getEventsForDate = (date) => {
    if (!date) return [];

    // Convert date to string for comparison (ignoring time)
    const dateStr = date.toISOString().split('T')[0];

    return events.filter(event => {
      const eventStart = new Date(event.startDate).toISOString().split('T')[0];
      const eventEnd = new Date(event.endDate).toISOString().split('T')[0];
      // Check if the date falls within the event's date range
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  /**
   * Checks if a date is today
   *
   * @param {Date|null} date - The date to check
   * @returns {boolean} True if the date is today
   */
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  /**
   * Checks if a date is the currently selected date
   *
   * @param {Date|null} date - The date to check
   * @returns {boolean} True if the date matches selectedDate
   */
  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  /**
   * Navigates to the previous month
   * Updates the currentMonth state to show the previous month's calendar
   */
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  /**
   * Navigates to the next month
   * Updates the currentMonth state to show the next month's calendar
   */
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  /**
   * Jumps to today's date
   * Updates both the displayed month and triggers the date click handler
   * This allows the user to quickly return to the current date
   */
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateClick(today);
  };

  // Generate the array of days to display in the calendar grid
  const days = getDaysInMonth(currentMonth);

  return (
    <div className="calendar">
      {/* Calendar header with navigation controls */}
      <div className="calendar-header">
        {/* Previous month button */}
        <button onClick={goToPreviousMonth} className="nav-button">‹</button>

        {/* Current month and year display */}
        <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>

        {/* Next month button */}
        <button onClick={goToNextMonth} className="nav-button">›</button>

        {/* Quick jump to today button */}
        <button onClick={goToToday} className="today-button">Today</button>
      </div>

      {/* Calendar grid containing day headers and date cells */}
      <div className="calendar-grid">
        {/* Day of week headers (Sun, Mon, Tue, etc.) */}
        {dayNames.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}

        {/* Date cells for each day in the month */}
        {days.map((date, index) => {
          // Get all events for this specific date
          const dayEvents = getEventsForDate(date);

          return (
            <div
              key={index}
              className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
              onClick={() => date && onDateClick(date)}
            >
              {/* Only render content for valid dates (not empty cells) */}
              {date && (
                <>
                  {/* Day number display */}
                  <div className="day-number">{date.getDate()}</div>

                  {/* Event indicators (colored dots) */}
                  <div className="day-events">
                    {/* Show up to 3 event dots */}
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event._id}
                        className="event-dot"
                        style={{ backgroundColor: event.color }}
                        onClick={(e) => {
                          // Prevent the date click handler from firing
                          e.stopPropagation();
                          // Trigger event click handler instead
                          onEventClick(event);
                        }}
                        title={event.title}
                      />
                    ))}

                    {/* If more than 3 events, show "+N" indicator */}
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
