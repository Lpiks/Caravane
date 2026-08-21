require('dotenv').config(); // Load env variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

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
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Basic root route
app.get('/', (req, res) => {
  res.send('Kouini Caravane API is running...');
});

// Mount API routes
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
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

// Render Free-Tier Keep Alive Pinger
// Render automatically injects RENDER_EXTERNAL_URL (e.g. https://my-app.onrender.com)
const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
if (RENDER_URL) {
  const https = require('https');
  setInterval(() => {
    https.get(RENDER_URL, (res) => {
      console.log(`Keep-alive self-ping status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('Keep-alive self-ping error:', err.message);
    });
  }, 13 * 60 * 1000); // Ping every 13 minutes
}
