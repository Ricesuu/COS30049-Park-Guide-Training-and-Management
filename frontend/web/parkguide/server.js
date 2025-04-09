// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Example route for an API endpoint
app.get('/api/:id', (req, res) => {
  res.json({ name: 'Park Guide', role: 'Admin' });
});

// Handle the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'parkguideDashboard.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
