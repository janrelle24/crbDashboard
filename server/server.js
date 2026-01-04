const express = require('express');

const path = require("path");
const connectDB = require("./config/db");

const News = require("./model/news");

const app = express();
const PORT = 3000;

/* Connect Database */
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../public")));

// save news
app.post('/api/news', async (req, res) =>{
    try{
        const news = await News.create(req.body);
        res.status(201).json(news);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save news item' });
    }
});

//start server
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`);
});
