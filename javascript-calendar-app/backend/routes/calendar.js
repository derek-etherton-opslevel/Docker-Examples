/**
 * Calendar Routes
 *
 * This module defines all API endpoints for managing calendar events.
 * It provides a RESTful interface for CRUD operations on events.
 *
 * Base path: /api/calendar
 *
 * Available endpoints:
 * - GET    /events       - Retrieve all events (optionally filtered by date range)
 * - GET    /events/:id   - Retrieve a specific event by ID
 * - POST   /events       - Create a new event
 * - PUT    /events/:id   - Update an existing event
 * - DELETE /events/:id   - Delete an event
 */

import express from 'express';
import Event from '../models/Event.js';

// Create an Express router instance for event-related routes
const router = express.Router();

/**
 * GET /events
 *
 * Retrieves all events from the database, with optional date range filtering.
 *
 * Query Parameters:
 * @param {string} startDate - Optional ISO date string for the start of the range
 * @param {string} endDate - Optional ISO date string for the end of the range
 *
 * The date filtering logic handles three scenarios:
 * 1. Events that start within the date range
 * 2. Events that end within the date range
 * 3. Events that span the entire date range
 *
 * @returns {Array} JSON array of event objects, sorted by start date
 * @throws {500} Internal server error if database query fails
 */
router.get('/events', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    // If both date parameters are provided, construct a complex query
    // to find all events that overlap with the specified date range
    if (startDate && endDate) {
      query = {
        $or: [
          {
            // Events that start within the specified range
            startDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
          },
          {
            // Events that end within the specified range
            endDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
          },
          {
            // Events that completely span the specified range
            startDate: { $lte: new Date(startDate) },
            endDate: { $gte: new Date(endDate) }
          }
        ]
      };
    }
    
    // Query the database and sort results by start date (ascending)
    const events = await Event.find(query).sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    // Return error message if query fails
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /events/:id
 *
 * Retrieves a single event by its unique identifier.
 *
 * @param {string} id - MongoDB ObjectId of the event (from URL parameter)
 * @returns {Object} JSON object containing the event data
 * @throws {404} Event not found if no event exists with the given ID
 * @throws {500} Internal server error if database query fails
 */
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    // Check if event exists in the database
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /events
 *
 * Creates a new event in the database.
 *
 * Request Body:
 * @param {string} title - Event title (required)
 * @param {string} description - Event description (optional)
 * @param {string} startDate - ISO date string for event start (required)
 * @param {string} endDate - ISO date string for event end (required)
 * @param {string} color - Hex color code for event display (optional, default: #3b82f6)
 *
 * @returns {Object} JSON object of the newly created event with 201 status
 * @throws {400} Bad request if validation fails or required fields are missing
 */
router.post('/events', async (req, res) => {
  try {
    // Create a new Event instance from the request body
    const event = new Event(req.body);

    // Save the event to the database (triggers validation)
    await event.save();

    // Return the created event with 201 Created status
    res.status(201).json(event);
  } catch (error) {
    // Return 400 Bad Request for validation errors
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /events/:id
 *
 * Updates an existing event with new data.
 *
 * @param {string} id - MongoDB ObjectId of the event to update (from URL parameter)
 *
 * Request Body: Any valid Event fields to update
 *
 * Options:
 * - new: true - Returns the updated document instead of the original
 * - runValidators: true - Ensures update data passes schema validation
 *
 * @returns {Object} JSON object of the updated event
 * @throws {404} Event not found if no event exists with the given ID
 * @throws {400} Bad request if validation fails
 */
router.put('/events/:id', async (req, res) => {
  try {
    // Find event by ID and update it with the request body data
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // Return updated doc and validate
    );

    // Check if event exists
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    // Return 400 for validation errors
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /events/:id
 *
 * Permanently deletes an event from the database.
 *
 * @param {string} id - MongoDB ObjectId of the event to delete (from URL parameter)
 * @returns {Object} Success message confirming deletion
 * @throws {404} Event not found if no event exists with the given ID
 * @throws {500} Internal server error if deletion fails
 */
router.delete('/events/:id', async (req, res) => {
  try {
    // Find and delete the event by ID
    const event = await Event.findByIdAndDelete(req.params.id);

    // Check if event existed
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Return success message
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router to be mounted in the main application
export default router;
