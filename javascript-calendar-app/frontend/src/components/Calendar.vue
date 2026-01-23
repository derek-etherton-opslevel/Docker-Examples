<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="goToPreviousMonth" class="nav-button">‹</button>
      <h2>{{ monthNames[currentMonth.getMonth()] }} {{ currentMonth.getFullYear() }}</h2>
      <button @click="goToNextMonth" class="nav-button">›</button>
      <button @click="goToToday" class="today-button">Today</button>
    </div>
    <div class="calendar-grid">
      <div
        v-for="day in dayNames"
        :key="day"
        class="calendar-day-header"
      >
        {{ day }}
      </div>
      <div
        v-for="(date, index) in days"
        :key="index"
        :class="[
          'calendar-day',
          { 'empty': !date },
          { 'today': isToday(date) },
          { 'selected': isSelected(date) }
        ]"
        @click="date && $emit('date-click', date)"
      >
        <template v-if="date">
          <div class="day-number">{{ date.getDate() }}</div>
          <div class="day-events">
            <div
              v-for="event in getEventsForDate(date).slice(0, 3)"
              :key="event._id"
              class="event-dot"
              :style="{ backgroundColor: event.color }"
              :title="event.title"
              @click.stop="$emit('event-click', event)"
            />
            <div
              v-if="getEventsForDate(date).length > 3"
              class="more-events"
            >
              +{{ getEventsForDate(date).length - 3 }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import './Calendar.css';

const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  selectedDate: {
    type: Date,
    required: true
  }
});

const emit = defineEmits(['date-click', 'event-click']);

const currentMonth = ref(props.selectedDate);

watch(() => props.selectedDate, (newDate) => {
  currentMonth.value = newDate;
});

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
  return props.events.filter(event => {
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
  return date.toDateString() === props.selectedDate.toDateString();
};

const goToPreviousMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
};

const goToNextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
};

const goToToday = () => {
  const today = new Date();
  currentMonth.value = today;
  emit('date-click', today);
};

const days = computed(() => getDaysInMonth(currentMonth.value));
</script>
