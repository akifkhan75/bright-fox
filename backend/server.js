
// backend/server.js
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();
// const PORT = process.env.PORT || 3002; // Backend server port
const PORT = 3002; // Backend server port

// Middleware
app.use(cors()); // Enable CORS for all routes (for development)
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use('/api', apiRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.send('BrightFox Backend is running!');
});

app.listen(PORT, () => {
  console.log(`BrightFox Backend server listening on port ${PORT}`);
});
