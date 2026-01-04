const express = require('express');

const path = require("path");
const connectDB = require("./config/db");

const app = express();
const PORT = 3000;

/* Connect Database */
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../public")));


//start server
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`);
});
