<template>
  <div class="app">
    <header class="app-header">
      <h1>Calendar App</h1>
    </header>
    <main class="app-main">
      <div v-if="loading" class="loading">Loading events...</div>
      <Calendar
        v-else
        :events="events"
        :selectedDate="selectedDate"
        @date-click="handleDateClick"
        @event-click="handleEventClick"
      />
      <EventForm
        v-if="showForm"
        :event="selectedEvent"
        :initialDate="selectedDate"
        @save="handleSaveEvent"
        @delete="handleDeleteEvent"
        @close="handleCloseForm"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Calendar from './components/Calendar.vue';
import EventForm from './components/EventForm.vue';
import { getEvents, createEvent, updateEvent, deleteEvent } from './services/api';
import './App.css';

const events = ref([]);
const selectedDate = ref(new Date());
const selectedEvent = ref(null);
const showForm = ref(false);
const loading = ref(true);

onMounted(() => {
  loadEvents();
});

const loadEvents = async () => {
  try {
    loading.value = true;
    const data = await getEvents();
    events.value = data;
  } catch (error) {
    console.error('Error loading events:', error);
  } finally {
    loading.value = false;
  }
};

const handleDateClick = (date) => {
  selectedDate.value = date;
  selectedEvent.value = null;
  showForm.value = true;
};

const handleEventClick = (event) => {
  selectedEvent.value = event;
  showForm.value = true;
};

const handleSaveEvent = async (eventData) => {
  try {
    if (selectedEvent.value) {
      await updateEvent(selectedEvent.value._id, eventData);
    } else {
      await createEvent(eventData);
    }
    await loadEvents();
    showForm.value = false;
    selectedEvent.value = null;
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
      showForm.value = false;
      selectedEvent.value = null;
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  }
};

const handleCloseForm = () => {
  showForm.value = false;
  selectedEvent.value = null;
};
</script>
