import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// Get all events
router.get('/events', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    if (startDate && endDate) {
      query = {
        $or: [
          {
            startDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
          },
          {
            endDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
          },
          {
            startDate: { $lte: new Date(startDate) },
            endDate: { $gte: new Date(endDate) }
          }
        ]
      };
    }
    
    const events = await Event.find(query).sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update event
router.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete event
router.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
