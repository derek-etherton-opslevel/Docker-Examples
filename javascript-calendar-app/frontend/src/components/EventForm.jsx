import React, { useState, useEffect } from 'react';
import './EventForm.css';

const EventForm = ({ event, initialDate, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState('#3b82f6');

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      setStartDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0, 5));
      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(end.toTimeString().slice(0, 5));
      setColor(event.color || '#3b82f6');
    } else if (initialDate) {
      const dateStr = initialDate.toISOString().split('T')[0];
      setStartDate(dateStr);
      setEndDate(dateStr);
    }
  }, [event, initialDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      alert('End date/time must be after start date/time');
      return;
    }

    onSave({
      title,
      description,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      color
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-form" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Event description"
            />
          </div>
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
          <div className="form-actions">
            {event && onDelete && (
              <button
                type="button"
                className="delete-button"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
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
