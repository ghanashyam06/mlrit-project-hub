const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Sample API route
app.get('/api/info', (req, res) => {
  res.status(200).json({
    project: 'MLRIT Project Hub',
    version: '1.0.0',
    description: 'Central Intelligence Hub for MLRIT Project Management'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
