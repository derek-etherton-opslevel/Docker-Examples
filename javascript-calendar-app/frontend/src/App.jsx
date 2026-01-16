import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import { getEvents, createEvent, updateEvent, deleteEvent } from './services/api';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, eventData);
      } else {
        await createEvent(eventData);
      }
      await loadEvents();
      setShowForm(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        await loadEvents();
        setShowForm(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
      }
    }
  };

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
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : (
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
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
