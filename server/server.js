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
/**start script for news**/
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

//render news
app.get('/api/news', async (req, res) =>{
    try{
        const news = await News.find().sort({ date: -1 });
        res.json(news);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch news items' });
    }
});
//delete news
app.delete('/api/news/:id', async (req, res) =>{
    try{
        await News.findByIdAndDelete(req.params.id);
        res.json({ message: "News deleted" });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete news item' });
    }
});
//update news
app.put('/api/news/:id', async (req, res) =>{
    try{
        const updated = await News.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    }catch(err){
        res.status(500).json({ error: "Update failed" });
    }
});
/**end script for news**/
//start server
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`);
});
