/**
 * App Component
 *
 * The root component of the Calendar application. This component manages the main
 * application state and coordinates interaction between the Calendar and EventForm components.
 *
 * Responsibilities:
 * - Loading and managing the list of events from the backend
 * - Handling user interactions (date clicks, event clicks)
 * - Managing the event creation/editing form visibility
 * - Coordinating CRUD operations on events (create, read, update, delete)
 *
 * State Management:
 * - events: Array of all calendar events
 * - selectedDate: Currently selected date in the calendar
 * - selectedEvent: Event being edited (null for new events)
 * - showForm: Boolean controlling the event form modal visibility
 * - loading: Boolean indicating if events are being loaded
 */

import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import { getEvents, createEvent, updateEvent, deleteEvent } from './services/api';
import './App.css';

function App() {
  // State for storing all calendar events
  const [events, setEvents] = useState([]);

  // Currently selected date (used when creating new events)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Currently selected event (null when creating a new event)
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Controls visibility of the event form modal
  const [showForm, setShowForm] = useState(false);

  // Loading state for initial events fetch
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Load events on component mount
   * Runs once when the component first renders to fetch all events from the backend
   */
  useEffect(() => {
    loadEvents();
  }, []);

  /**
   * Loads all events from the backend API
   * Sets loading state and handles errors appropriately
   *
   * @async
   */
  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      // Note: Could add user-facing error notification here
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles clicks on calendar dates
   * Opens the event form to create a new event on the selected date
   *
   * @param {Date} date - The clicked date
   */
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);  // Clear any previously selected event
    setShowForm(true);
  };

  /**
   * Handles clicks on existing events
   * Opens the event form in edit mode for the selected event
   *
   * @param {Object} event - The event object that was clicked
   */
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  /**
   * Saves an event (either creating a new one or updating an existing one)
   * Determines whether to create or update based on whether an event is currently selected
   *
   * @async
   * @param {Object} eventData - The event data from the form
   * @param {string} eventData.title - Event title
   * @param {string} eventData.description - Event description
   * @param {string} eventData.startDate - Event start date/time (ISO string)
   * @param {string} eventData.endDate - Event end date/time (ISO string)
   * @param {string} eventData.color - Event color (hex code)
   */
  const handleSaveEvent = async (eventData) => {
    try {
      // Update existing event or create new one
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, eventData);
      } else {
        await createEvent(eventData);
      }

      // Reload events to reflect changes
      await loadEvents();

      // Close the form and clear selection
      setShowForm(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  /**
   * Deletes an event after user confirmation
   *
   * @async
   * @param {string} eventId - The ID of the event to delete
   */
  const handleDeleteEvent = async (eventId) => {
    // Confirm deletion with the user
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);

        // Reload events to reflect deletion
        await loadEvents();

        // Close the form and clear selection
        setShowForm(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
      }
    }
  };

  /**
   * Closes the event form modal without saving
   * Resets the selected event state
   */
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEvent(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Calendar App</h1>
      </header>
      <main className="app-main">
        {/* Show loading message while events are being fetched */}
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : (
          /* Display the calendar with all events */
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}

        {/* Show event form modal when showForm is true */}
        {showForm && (
          <EventForm
            event={selectedEvent}
            initialDate={selectedDate}
            onSave={handleSaveEvent}
            onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent._id) : null}
            onClose={handleCloseForm}
          />
        )}
      </main>
    </div>
  );
}

export default App;
