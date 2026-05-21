/**
 * Calendar Application Backend Server
 *
 * This is the main entry point for the backend server of the calendar application.
 * It sets up an Express server with MongoDB connectivity and API routes for
 * managing calendar events.
 *
 * Features:
 * - RESTful API for calendar event management
 * - MongoDB database integration using Mongoose
 * - CORS support for cross-origin requests
 * - JSON request/response handling
 * - Health check endpoint for monitoring
 */

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import calendarRoutes from './routes/calendar.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Server configuration from environment variables with fallback defaults
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/calendar';

/**
 * Middleware Configuration
 */

// Enable CORS (Cross-Origin Resource Sharing) to allow frontend to make requests
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

/**
 * Route Configuration
 */

// Mount calendar routes under the /api/calendar path
app.use('/api/calendar', calendarRoutes);

/**
 * Health Check Endpoint
 *
 * Simple endpoint to verify the server is running and responsive.
 * Useful for container orchestration systems and monitoring tools.
 *
 * @route GET /health
 * @returns {Object} Status object with 'ok' status and current timestamp
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Database Connection and Server Startup
 *
 * Establishes connection to MongoDB before starting the HTTP server.
 * This ensures the database is available before accepting requests.
 *
 * The server listens on 0.0.0.0 to accept connections from any network interface,
 * which is necessary for Docker container networking.
 */
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the server only after successful database connection
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // Log the error and exit if database connection fails
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit with error code
  });
