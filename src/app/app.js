const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');

const app = express();

// Global Middleware
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173', 
  process.env.FRONTEND_URL, // e.g. https://your-production-url.com
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // allow localhost, defined frontend URL, or Vercel preview URLs
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies to be sent back and forth
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get('/', (req, res) => {
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
