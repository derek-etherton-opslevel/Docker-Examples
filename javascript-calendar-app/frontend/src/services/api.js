import axios from 'axios';

// In production, use relative URLs (nginx proxies /api to backend)
// In development, use the full backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getEvents = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await api.get('/calendar/events', { params });
  return response.data;
};

export const getEvent = async (id) => {
  const response = await api.get(`/calendar/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/calendar/events', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/calendar/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/calendar/events/${id}`);
  return response.data;
};
