/**
 * Stay Kerala Backend Server
 * Node.js backend application entry point
 * 
 * This server provides API endpoints for:
 * - Partner authentication and management
 * - Admin authentication and management
 * - Customer registration/login (only at booking time)
 * - Property management
 * - Booking management
 * - Image uploads
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (to be implemented)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/properties', require('./routes/properties'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/partners', require('./routes/partners'));
// app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stay Kerala API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Stay Kerala API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      properties: '/api/properties',
      bookings: '/api/bookings',
      partners: '/api/partners',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
