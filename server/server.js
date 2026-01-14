require("dotenv").config();
const express = require('express');
const multer = require("multer");
const path = require("path");
//Load env + auth deps
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");

const News = require("./model/news");
const Events = require("./model/events");
const Ordinance = require("./model/ordinance");
const Members = require("./model/members");
const Live = require("./model/live");
const User = require("./model/user");

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

//JWT middleware
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
//register
app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const exists = await User.findOne({ username });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            password: hashedPassword
        });

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});
//login
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

/**start script for news**/
// save news
app.post('/api/news', auth, upload.single("image"), async (req, res) =>{
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
app.delete('/api/news/:id', auth, async (req, res) =>{
    try{
        await News.findByIdAndDelete(req.params.id);
        res.json({ message: "News deleted" });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete news item' });
    }
});
//update news
app.put('/api/news/:id', auth, async (req, res) =>{
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
//count news
app.get("/api/news/count", async (req, res) =>{
    try{
        const count = await News.countDocuments();
        res.json({ count });
    }catch(err){
        res.status(500).json({ error: "Failed to count news" });
    }
});
/**end script for news**/
/**start script for events**/
//save events
app.post('/api/events', auth, async (req, res) =>{
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
app.put('/api/events/:id', auth, async (req, res) => {
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
app.delete('/api/events/:id', auth, async (req, res) => {
    try {
        await Events.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});
//count events
app.get("/api/events/count", async (req, res) =>{
    try{
        const count = await Events.countDocuments();
        res.json({ count });
    }catch(err){
        res.status(500).json({ error: "Failed to count events" });
    }
});
/**end script for events**/
/**start script for ordinance**/
//save ordinance
app.post('/api/ordinance', auth, async (req, res) =>{
    try{
        const ordinance = await Ordinance.create(req.body);
        res.status(201).json(ordinance);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save ordinance item' });
    }
});
//render ordinance
app.get('/api/ordinance', async (req, res) =>{
    try{
        const ordinance = await Ordinance.find().sort({ date: -1 });
        res.json(ordinance);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch ordinance items' });
    }
});
//update
app.put('/api/ordinance/:id', auth, async (req, res) => {
    try {
        const updated = await Ordinance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update ordinance' });
    }
});
//delete
app.delete('/api/ordinance/:id', auth, async (req, res) => {
    try {
        await Ordinance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ordinance deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete ordinance' });
    }
});
//count ordinance
app.get("/api/ordinance/count", async (req, res) =>{
    try{
        const count = await Ordinance.countDocuments();
        res.json({ count });
    }catch(err){
        res.status(500).json({ error: "Failed to count ordinance" });
    }
});
/**end script for ordinance**/
/**start script for members**/
// save members
app.post('/api/members', auth, upload.single("image"), async (req, res) =>{
    try{
        const members = await Members.create({
            image: req.file ? `/uploads/${req.file.filename}` : "",
            name: req.body.name,
            position: req.body.position,
            birthDate: req.body.birthDate,
            education: req.body.education,
            achievements: req.body.achievements
        });
        res.status(201).json(members);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save members item' });
    }
});

//render members
app.get('/api/members', async (req, res) =>{
    try{
        const members = await Members.find().sort({ date: -1 });
        res.json(members);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch members items' });
    }
});
//delete members
app.delete('/api/members/:id', auth, async (req, res) =>{
    try{
        await Members.findByIdAndDelete(req.params.id);
        res.json({ message: "Members deleted" });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete members item' });
    }
});
//update members
app.put('/api/members/:id', auth, async (req, res) =>{
    try{
        const updateData = {
            name: req.body.name,
            position: req.body.position,
            birthDate: req.body.birthDate,
            education: req.body.education,
            achievements: req.body.achievements,
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updated = await Members.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updated);
    }catch(err){
        res.status(500).json({ error: "Update failed" });
    }
});
//count members
app.get("/api/members/count", async (req, res) =>{
    try{
        const count = await Members.countDocuments();
        res.json({ count });
    }catch(err){
        res.status(500).json({ error: "Failed to count members" });
    }
});
/**end script for members**/
/**start script for live**/
//save live
app.post('/api/live', auth, async (req, res) =>{
    try{
        const live = await Live.create(req.body);
        res.status(201).json(live);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save live item' });
    }
});
//render live
app.get('/api/live', async (req, res) =>{
    try{
        const live = await Live.find().sort({ date: -1 });
        res.json(live);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch live items' });
    }
});
//update
app.put('/api/live/:id', auth, async (req, res) => {
    try {
        const updated = await Live.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update live' });
    }
});
//delete
app.delete('/api/live/:id', auth, async (req, res) => {
    try {
        await Live.findByIdAndDelete(req.params.id);
        res.json({ message: 'Live deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete live' });
    }
});
//count live
app.get("/api/live/count", async (req, res) =>{
    try{
        const count = await Live.countDocuments();
        res.json({ count });
    }catch(err){
        res.status(500).json({ error: "Failed to count live" });
    }
});
/**end script for live**/
// recent activities
app.get("/api/recent-activity", async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 }).limit(5);
        const events = await Events.find().sort({ createdAt: -1 }).limit(5);
        const live = await Live.find().sort({ createdAt: -1 }).limit(5);
        const ordinances = await Ordinance.find().sort({ createdAt: -1 }).limit(5);
        const members = await Members.find().sort({ createdAt: -1 }).limit(5);

        // Combine into a single array with type & date
        let activities = [];

        news.forEach(n => activities.push({ type: "news", message: n.title, date: n.createdAt }));
        events.forEach(e => activities.push({ type: "event", message: e.title, date: e.createdAt }));
        live.forEach(l => activities.push({ type: "live", message: l.title, date: l.createdAt }));
        ordinances.forEach(o => activities.push({ type: "ordinance", message: o.title, date: o.createdAt }));
        members.forEach(m => activities.push({ type: "member", message: m.name, date: m.createdAt }));

        // Sort by newest first
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Send top 4
        res.json(activities.slice(0, 4));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch recent activities" });
    }
});

//start server
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`);
});
