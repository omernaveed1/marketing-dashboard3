const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS if you want to allow cross-origin requests
app.use(cors());
app.use(express.json());

// === API ROUTES (add your API endpoints here) ===
// Example:
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend API!' });
});

// === SERVE REACT STATIC FILES ===

// If you use Vite, the production build is in 'dist'.
// If you use Create React App, the build folder is 'build'.
const clientBuildPath = path.join(__dirname, 'dist'); // Change 'dist' to 'build' if needed

app.use(express.static(clientBuildPath));

// For all other routes, serve index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving static files from ${clientBuildPath}`);
});