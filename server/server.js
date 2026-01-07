const express = require('express');
const multer = require("multer");

const path = require("path");
const connectDB = require("./config/db");

const News = require("./model/news");
const Events = require("./model/events");

const app = express();
const PORT = 3000;

/* Connect Database */
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static("uploads"));
/* Multer config */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });
/**start script for news**/
// save news
app.post('/api/news', upload.single("image"), async (req, res) =>{
    try{
        const news = await News.create({
            image: req.file ? `/uploads/${req.file.filename}` : "",
            title: req.body.title,
            content: req.body.content
        });
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
        const updateData = {
            title: req.body.title,
            content: req.body.content
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updated = await News.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updated);
    }catch(err){
        res.status(500).json({ error: "Update failed" });
    }
});
/**end script for news**/
/**start script for events**/
//save events
app.post('/api/events', async (req, res) =>{
    try{
        const event = await Events.create(req.body);
        res.status(201).json(event);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save events item' });
    }
});
//render events
app.get('/api/events', async (req, res) =>{
    try{
        const events = await Events.find().sort({ date: -1 });
        res.json(events);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch events items' });
    }
});
//update
app.put('/api/events/:id', async (req, res) => {
    try {
        const updated = await Events.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});
//delete
app.delete('/api/events/:id', async (req, res) => {
    try {
        await Events.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});
/**end script for events**/
//start server
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`);
});
