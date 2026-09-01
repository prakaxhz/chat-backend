const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { StatusCodes } = require('http-status-codes');

const app = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(StatusCodes.OK).json({ 
    success: true, 
    message: 'Server is healthy and running' 
  });
});

// Initialize Background Workers (BullMQ)
require('../infrastructure/queue');

// Mount all API Routes
const apiRoutes = require('./routes');
app.use('/api/v1', apiRoutes);

// Global Error Handler
const errorHandler = require('../middleware/error.middleware');
app.use(errorHandler);

module.exports = app;
