<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="event-form" @click.stop>
      <div class="form-header">
        <h2>{{ event ? 'Edit Event' : 'Create Event' }}</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Title *</label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="Event title"
          />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="description"
            rows="3"
            placeholder="Event description"
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Start Date *</label>
            <input
              v-model="startDate"
              type="date"
              required
            />
          </div>
          <div class="form-group">
            <label>Start Time *</label>
            <input
              v-model="startTime"
              type="time"
              required
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>End Date *</label>
            <input
              v-model="endDate"
              type="date"
              required
            />
          </div>
          <div class="form-group">
            <label>End Time *</label>
            <input
              v-model="endTime"
              type="time"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label>Color</label>
          <div class="color-picker">
            <button
              v-for="c in colors"
              :key="c"
              type="button"
              :class="['color-option', { 'selected': color === c }]"
              :style="{ backgroundColor: c }"
              @click="color = c"
            />
          </div>
        </div>
        <div class="form-actions">
          <button
            v-if="event"
            type="button"
            class="delete-button"
            @click="$emit('delete', event._id)"
          >
            Delete
          </button>
          <div class="form-actions-right">
            <button type="button" class="cancel-button" @click="$emit('close')">
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ event ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import './EventForm.css';

const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  initialDate: {
    type: Date,
    required: true
  }
});

const emit = defineEmits(['save', 'delete', 'close']);

const title = ref('');
const description = ref('');
const startDate = ref('');
const startTime = ref('09:00');
const endDate = ref('');
const endTime = ref('10:00');
const color = ref('#3b82f6');

const colors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

// Initialize form data when event or initialDate changes
const initializeForm = () => {
  if (props.event) {
    title.value = props.event.title;
    description.value = props.event.description || '';
    const start = new Date(props.event.startDate);
    const end = new Date(props.event.endDate);
    startDate.value = start.toISOString().split('T')[0];
    startTime.value = start.toTimeString().slice(0, 5);
    endDate.value = end.toISOString().split('T')[0];
    endTime.value = end.toTimeString().slice(0, 5);
    color.value = props.event.color || '#3b82f6';
  } else if (props.initialDate) {
    const dateStr = props.initialDate.toISOString().split('T')[0];
    startDate.value = dateStr;
    endDate.value = dateStr;
  }
};

// Initialize on mount and when props change
watch([() => props.event, () => props.initialDate], initializeForm, { immediate: true });

const handleSubmit = () => {
  const startDateTime = new Date(`${startDate.value}T${startTime.value}`);
  const endDateTime = new Date(`${endDate.value}T${endTime.value}`);

  if (endDateTime <= startDateTime) {
    alert('End date/time must be after start date/time');
    return;
  }

  emit('save', {
    title: title.value,
    description: description.value,
    startDate: startDateTime.toISOString(),
    endDate: endDateTime.toISOString(),
    color: color.value
  });
};
</script>
