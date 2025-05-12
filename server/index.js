const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./db');
const fs = require('fs');
const https = require('https'); // Add https module
dotenv.config();

const app = express();
// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'], // Allow both HTTP and HTTPS origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true,
}));
//app.use(cors());
app.use(express.json());

connection();

const sensorRoutes = require("./routes/sensorRoute")
const userdbRoutes = require("./routes/userRoute");
// Test route
app.get('/api/status', (req, res) => {
  const status = {
    sessionStatus: 'online',
    account: 'Rohit Ningthoujam (Plan: Free)',
    version: '3.22.1',
    region: 'India (in)',
    latency: '66ms',
    webInterface: 'http://127.0.0.1:4040',
    forwarding: 'https://edff-49-47-141-180.ngrok-free.app -> http://localhost:8080',
    connections: {
      ttl: 185,
      opn: 0,
      rt1: 0.41,
      rt5: 0.37,
      p50: 5.09,
      p90: 5.11,
    },
  };
  res.json(status);
});
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.use("/api/s",sensorRoutes);
app.use("/api/authentication", userdbRoutes)


const cert = fs.readFileSync('localhost+2.pem');
const key = fs.readFileSync('localhost+2-key.pem');

// Create HTTPS server
const PORT = process.env.PORT || 8080;
https.createServer({ cert, key }, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
// const PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));