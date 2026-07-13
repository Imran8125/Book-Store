const express = require('express');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ["http://localhost:5174"];

app.use(cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}));

// Body parser middleware
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', adminRoutes);
app.use('/', sellerRoutes);
app.use('/', userRoutes);

// Fallback Route
app.get('/', (req, res) => {
    res.json({ message: "BookStore API is running..." });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

module.exports = app;
