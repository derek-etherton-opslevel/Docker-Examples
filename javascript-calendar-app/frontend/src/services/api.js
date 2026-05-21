/**
 * API Service Module
 *
 * This module provides a centralized interface for all backend API calls.
 * It uses Axios for HTTP requests and handles the communication between
 * the frontend and the calendar events API.
 *
 * The API base URL is configurable:
 * - In production: Uses relative URLs (nginx proxies /api to backend)
 * - In development: Can be overridden with VITE_API_URL environment variable
 */

import axios from 'axios';

// Configure API base URL from environment variable or use default
// In production, use relative URLs (nginx proxies /api to backend)
// In development, use the full backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Create an Axios instance with default configuration
 * This instance is pre-configured with the base URL and default headers
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Retrieves all events from the backend, with optional date filtering
 *
 * @param {string} startDate - Optional ISO date string for filtering events (start of range)
 * @param {string} endDate - Optional ISO date string for filtering events (end of range)
 * @returns {Promise<Array>} Array of event objects
 * @throws {Error} If the API request fails
 */
export const getEvents = async (startDate, endDate) => {
  const params = {};
  // Only include date parameters if they are provided
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await api.get('/calendar/events', { params });
  return response.data;
};

/**
 * Retrieves a single event by its ID
 *
 * @param {string} id - The unique identifier of the event
 * @returns {Promise<Object>} The event object
 * @throws {Error} If the event is not found or the request fails
 */
export const getEvent = async (id) => {
  const response = await api.get(`/calendar/events/${id}`);
  return response.data;
};

/**
 * Creates a new event in the database
 *
 * @param {Object} eventData - The event data to create
 * @param {string} eventData.title - Event title (required)
 * @param {string} eventData.description - Event description (optional)
 * @param {string} eventData.startDate - Event start date/time (required)
 * @param {string} eventData.endDate - Event end date/time (required)
 * @param {string} eventData.color - Event color (optional)
 * @returns {Promise<Object>} The created event object with ID
 * @throws {Error} If validation fails or the request fails
 */
export const createEvent = async (eventData) => {
  const response = await api.post('/calendar/events', eventData);
  return response.data;
};

/**
 * Updates an existing event with new data
 *
 * @param {string} id - The unique identifier of the event to update
 * @param {Object} eventData - The updated event data (partial updates are supported)
 * @returns {Promise<Object>} The updated event object
 * @throws {Error} If the event is not found or the request fails
 */
export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/calendar/events/${id}`, eventData);
  return response.data;
};

/**
 * Deletes an event from the database
 *
 * @param {string} id - The unique identifier of the event to delete
 * @returns {Promise<Object>} Confirmation message
 * @throws {Error} If the event is not found or the request fails
 */
export const deleteEvent = async (id) => {
  const response = await api.delete(`/calendar/events/${id}`);
  return response.data;
};
