/**
 * EventForm Component
 *
 * A modal form for creating new calendar events or editing existing ones.
 * The form provides inputs for all event properties and handles validation
 * before submission.
 *
 * Features:
 * - Dual mode: Create new events or edit existing ones
 * - Date and time inputs with validation
 * - Color picker for event customization
 * - Delete functionality for existing events
 * - Modal overlay with click-outside-to-close behavior
 * - Form validation (end date/time must be after start)
 *
 * Props:
 * @param {Object|null} event - Existing event to edit (null for new events)
 * @param {Date} initialDate - Default date for new events
 * @param {Function} onSave - Callback when form is submitted
 * @param {Function|null} onDelete - Callback when delete is clicked (null for new events)
 * @param {Function} onClose - Callback when form should be closed
 */

import React, { useState, useEffect } from 'react';
import './EventForm.css';

const EventForm = ({ event, initialDate, onSave, onDelete, onClose }) => {
  // Form field state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState('#3b82f6');

  // Available color options for events
  const colors = [
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16'  // Lime
  ];

  /**
   * Effect: Initialize form fields
   *
   * Runs when the component mounts or when event/initialDate props change.
   * If editing an existing event, populate form fields with event data.
   * If creating a new event, set default dates from initialDate.
   */
  useEffect(() => {
    if (event) {
      // Editing mode: Populate form with existing event data
      setTitle(event.title);
      setDescription(event.description || '');

      // Parse the event dates and separate into date and time components
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      // Extract date portion (YYYY-MM-DD format for date input)
      setStartDate(start.toISOString().split('T')[0]);
      // Extract time portion (HH:MM format for time input)
      setStartTime(start.toTimeString().slice(0, 5));

      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(end.toTimeString().slice(0, 5));

      setColor(event.color || '#3b82f6');
    } else if (initialDate) {
      // Creation mode: Set default dates from the selected calendar date
      const dateStr = initialDate.toISOString().split('T')[0];
      setStartDate(dateStr);
      setEndDate(dateStr);
    }
  }, [event, initialDate]);

  /**
   * Handles form submission
   *
   * Validates the form data and calls the onSave callback with the event data.
   * Performs validation to ensure end date/time is after start date/time.
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    // Prevent default form submission (page reload)
    e.preventDefault();
    
    // Combine date and time inputs into full Date objects
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Validate that end time is after start time
    if (endDateTime <= startDateTime) {
      alert('End date/time must be after start date/time');
      return;
    }

    // Call the save callback with formatted event data
    onSave({
      title,
      description,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      color
    });
  };

  return (
    /* Modal overlay - clicking it closes the form */
    <div className="modal-overlay" onClick={onClose}>
      {/* Form container - prevent clicks from closing the modal */}
      <div className="event-form" onClick={(e) => e.stopPropagation()}>
        {/* Form header with title and close button */}
        <div className="form-header">
          <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title input - required field */}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Event title"
            />
          </div>

          {/* Description textarea - optional field */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Event description"
            />
          </div>

          {/* Start date and time inputs in a row */}
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* End date and time inputs in a row */}
          <div className="form-row">
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Color picker - displays color options as clickable buttons */}
          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Action buttons: Delete (if editing), Cancel, and Save/Update */}
          <div className="form-actions">
            {/* Show delete button only when editing an existing event */}
            {event && onDelete && (
              <button
                type="button"
                className="delete-button"
                onClick={onDelete}
              >
                Delete
              </button>
            )}

            {/* Cancel and Save/Update buttons always on the right */}
            <div className="form-actions-right">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {event ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
