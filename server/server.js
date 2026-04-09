require("dotenv").config();   // ✅ Load env first

const express = require('express');
const cors = require('cors');

const connection = require('./database/database');
const userRoutes = require('./routes/userRoutes');
const brandRoutes = require('./routes/brandRoutes');
const carRoutes = require('./routes/carRoutes');
const chatRoute = require("./routes/chat");

const app = express();   // ✅ CREATE APP FIRST

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
connection();

// Static folder (for images)
app.use(express.static('uploads'));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/car', carRoutes);
app.use("/api/chat", chatRoute);   // ✅ NOW it's correct

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});