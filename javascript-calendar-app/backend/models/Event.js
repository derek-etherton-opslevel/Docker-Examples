/**
 * Event Model
 *
 * Defines the Mongoose schema and model for calendar events.
 * This model handles the storage and validation of event data in MongoDB.
 */

import mongoose from 'mongoose';

/**
 * Event Schema Definition
 *
 * Defines the structure of an event document in the MongoDB collection.
 * Each event contains information about a calendar event including:
 * - Basic information (title, description)
 * - Timing (start and end dates)
 * - Appearance (color for visual identification)
 * - Metadata (creation and update timestamps)
 */
const eventSchema = new mongoose.Schema({
  // Title of the event - required field with automatic whitespace trimming
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Optional description providing additional details about the event
  description: {
    type: String,
    default: ''
  },
  // Start date and time of the event - required field
  startDate: {
    type: Date,
    required: true
  },
  // End date and time of the event - required field
  endDate: {
    type: Date,
    required: true
  },
  // Hexadecimal color code for event visualization (default: blue)
  color: {
    type: String,
    default: '#3b82f6'
  },
  // Timestamp when the event was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Timestamp when the event was last updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save Middleware
 *
 * Automatically updates the 'updatedAt' timestamp whenever an event is saved.
 * This ensures the update time is always current, even if not explicitly set.
 *
 * @param {Function} next - Callback to proceed to the next middleware
 */
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Event model for use in other parts of the application
export default mongoose.model('Event', eventSchema);
