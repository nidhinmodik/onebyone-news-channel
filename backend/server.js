const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const db_connect = require('./utils/db');

dotenv.config();

// Set up CORS
if (process.env.MODE === 'production') {
    app.use(cors({
        origin: ["https://news-01-09-24-fmeu-8y7uke3i1-nidhinmodiks-projects.vercel.app"], // Specify allowed origins for production
        credentials: true,
    }));
} 
else {
    app.use(cors({
        origin: ["http://localhost:5173", "http://localhost:3000"], // Allow both origins in development
        credentials: true, // Support credentials (e.g., cookies)
    }));
}

// Set up body parsing middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/newsRoutes'));
app.use('/', require('./routes/adRoutes'));
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
const port = process.env.PORT || 5000; // Use PORT from .env or default to 5000
db_connect();
app.listen(port, () => console.log(`Server is running on port ${port}!`));