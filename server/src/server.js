require('dotenv').config(); // Load env variables
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');

// Initialize Express app
const app = express();

const { seedVehiclesIfEmpty } = require('./controllers/vehicleController');
const { seedComponentsIfEmpty } = require('./controllers/componentController');
const { seedChassisIfEmpty } = require('./controllers/chassisController');
const { seedAdminIfEmpty } = require('./controllers/adminController');

// Connect to Database
connectDB().then(() => {
  // Safe to seed now because connection is established
  seedAdminIfEmpty();
  seedVehiclesIfEmpty();
  seedComponentsIfEmpty();
  seedChassisIfEmpty();
});

// Middleware
// 1. Add Helmet for HTTP Header Security
app.use(helmet({ crossOriginResourcePolicy: false }));

// 2. Strict CORS Configuration
let allowedOrigin = process.env.CLIENT_URL;
if (!allowedOrigin) {
  // Safe fallback for local dev if .env is missing. DO NOT allow '*'.
  console.warn("WARNING: CLIENT_URL is not set in .env! CORS is locked to localhost.");
  allowedOrigin = 'http://localhost:3000';
} else if (allowedOrigin.endsWith('/')) {
  allowedOrigin = allowedOrigin.slice(0, -1);
}

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json({ limit: '2mb' })); // Strict 2 Megabyte limit on JSON bodies
app.use(express.urlencoded({ extended: true, limit: '2mb' })); // Limit URL-encoded bodies

// Data sanitization against NoSQL query injection (Custom wrapper to avoid Express getter crash)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  if (req.query) mongoSanitize.sanitize(req.query, { replaceWith: '_' });
  next();
});

// Basic root route
app.get('/', (req, res) => {
  res.send('Kouini Caravane API is running...');
});

const { apiLimiter, sensitiveLimiter } = require('./middleware/rateLimiter');

// Mount API routes (applying global rate limiter to all API endpoints)
app.use('/api', apiLimiter);

app.use('/api/inquiries', sensitiveLimiter, require('./routes/inquiryRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/studio', require('./routes/studioRoutes'));
app.use('/api/components', require('./routes/componentRoutes'));
app.use('/api/chassis', require('./routes/chassisRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep Alive Pinger (Render/VPS/Local)
// Set SELF_PING_URL in your .env or let Render auto-inject RENDER_EXTERNAL_URL
const RENDER_URL = process.env.SELF_PING_URL || process.env.RENDER_EXTERNAL_URL;
if (RENDER_URL) {
  const http = require('http');
  const https = require('https');
  const protocol = RENDER_URL.startsWith('https') ? https : http;
  
  setInterval(() => {
    protocol.get(RENDER_URL, (res) => {
      console.log(`Keep-alive self-ping status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('Keep-alive self-ping error:', err.message);
    });
  }, 13 * 60 * 1000); // Ping every 13 minutes
}
