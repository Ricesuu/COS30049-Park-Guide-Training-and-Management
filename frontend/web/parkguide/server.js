const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Example API endpoint
app.get('/api/:id', (req, res) => {
  res.json({ name: 'Park Guide', role: 'Admin' });
});

// Serve the dashboard HTML at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'parkguidedashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
