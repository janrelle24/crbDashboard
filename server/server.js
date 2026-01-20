require("dotenv").config();
const express = require('express');
const multer = require("multer");
const path = require("path");
//Load env + auth deps
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//cors for cross-origin requests
const cors = require("cors");

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
// Enable CORS
app.use(cors({
    origin: "*", // allow public site
    methods: ["GET"],
}));
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

        if (!username || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (password.length < 10) {
            return res.status(400).json({ message: "Password too short" });
        }
        
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

        if (err.code === 11000) {
            return res.status(400).json({ message: "Username already exists" });
        }
        console.error(err);
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
//logout
app.post("/api/logout", auth, (req, res) => {
    // For JWT, logout is handled on client side by deleting the token
    res.json({ message: "Logged out successfully" });
});
/**start script for news**/
// save news
app.post('/api/news', auth, upload.single("image"), async (req, res) =>{
    try{
        const news = await News.create({
            image: req.file ? `/uploads/${req.file.filename}` : "",
            title: req.body.title,
            content: req.body.content,
            createdBy: req.user.id
        });
        res.status(201).json(news);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to save news item' });
    }
});

//render news
app.get('/api/news', auth, async (req, res) =>{
    try{
        const news = await News.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(news);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch news items' });
    }
});
//delete news
app.delete('/api/news/:id', auth, async (req, res) =>{
    try{
        const deleted = await News.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!deleted) return res.status(404).json({ message: "News not found or unauthorized" });
        res.json({ message: "News deleted" });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete news item' });
    }
});
//update news
app.put('/api/news/:id', auth, upload.single("image"), async (req, res) =>{
    try{
        const updateData = {
            title: req.body.title,
            content: req.body.content
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updated = await News.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            updateData,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "News not found or unauthorized" });
        res.json(updated);
    }catch(err){
        res.status(500).json({ error: "Update failed" });
    }
});
//count news
app.get("/api/news/count", auth, async (req, res) =>{
    try{
        const count = await News.countDocuments({ createdBy: req.user.id });
        res.json({ count });
    }catch(err){
        res.status(500).json({ error: "Failed to count news" });
    }
});
//serve images
app.use("/uploads", express.static("uploads"));

//public news
app.get("/api/public/news", async (req, res) =>{
    try{
        const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
    }catch(err){
        res.status(500).json({ error: "Failed to fetch public news" });
    }
    
});
/**end script for news**/
/**start script for events**/
//save events
app.post('/api/events', auth, async (req, res) =>{
    try{
        const event = await Events.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json(event);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save events item' });
    }
});
//render events
app.get('/api/events', auth, async (req, res) =>{
    try{
        const events = await Events.find({ createdBy: req.user.id }).sort({ date: -1 });
        res.json(events);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch events items' });
    }
});
//update
app.put('/api/events/:id', auth, async (req, res) => {
    try {
        const updated = await Events.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Event not found or unauthorized" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});
//delete
app.delete('/api/events/:id', auth, async (req, res) => {
    try {
        const deleted = await Events.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!deleted) return res.status(404).json({ message: "Event not found or unauthorized" });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});
//count events
app.get("/api/events/count", auth, async (req, res) =>{
    try{
        const count = await Events.countDocuments({ createdBy: req.user.id });
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
        const ordinance = await Ordinance.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json(ordinance);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save ordinance item' });
    }
});
//render ordinance
app.get('/api/ordinance', auth, async (req, res) =>{
    try{
        const ordinance = await Ordinance.find({ createdBy: req.user.id }).sort({ date: -1 });
        res.json(ordinance);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch ordinance items' });
    }
});
//update
app.put('/api/ordinance/:id', auth, async (req, res) => {
    try {
        const updated = await Ordinance.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Ordinance not found or unauthorized" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update ordinance' });
    }
});
//delete
app.delete('/api/ordinance/:id', auth, async (req, res) => {
    try {
        const deleted = await Ordinance.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!deleted) return res.status(404).json({ message: "Ordinance not found or unauthorized" });
        res.json({ message: 'Ordinance deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete ordinance' });
    }
});
//count ordinance
app.get("/api/ordinance/count", auth, async (req, res) =>{
    try{
        const count = await Ordinance.countDocuments({ createdBy: req.user.id });
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
            achievements: req.body.achievements,
            createdBy: req.user.id
        });
        res.status(201).json(members);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save members item' });
    }
});

//render members
app.get('/api/members', auth, async (req, res) =>{
    try{
        const members = await Members.find({ createdBy: req.user.id }).sort({ date: -1 });
        res.json(members);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch members items' });
    }
});
//delete members
app.delete('/api/members/:id', auth, async (req, res) =>{
    try{
        const deleted = await Members.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!deleted) return res.status(404).json({ message: "Members not found or unauthorized" });
        res.json({ message: "Members deleted" });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete members item' });
    }
});
//update members
app.put('/api/members/:id', auth, upload.single("image"), async (req, res) =>{
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

        const updated = await Members.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            updateData,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Members not found or unauthorized" });
        res.json(updated);
    }catch(err){
        res.status(500).json({ error: "Update failed" });
    }
});
//count members
app.get("/api/members/count", auth, async (req, res) =>{
    try{
        const count = await Members.countDocuments({ createdBy: req.user.id });
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
        const live = await Live.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json(live);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to save live item' });
    }
});
//render live
app.get('/api/live', auth, async (req, res) =>{
    try{
        const live = await Live.find({ createdBy: req.user.id }).sort({ date: -1 });
        res.json(live);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch live items' });
    }
});
//update
app.put('/api/live/:id', auth, async (req, res) => {
    try {
        const updated = await Live.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            req.body,
            { new: true }
        );
        res.json(updated);
        if (!updated) return res.status(404).json({ message: "Live not found or unauthorized" });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update live' });
    }
});
//delete
app.delete('/api/live/:id', auth, async (req, res) => {
    try {
        const deleted = await Live.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!deleted) return res.status(404).json({ message: "Live not found or unauthorized" });
        res.json({ message: 'Live deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete live' });
    }
});
//count live
app.get("/api/live/count", auth, async (req, res) =>{
    try{
        const count = await Live.countDocuments({ createdBy: req.user.id });
        res.json({ count });
    }catch(err){
        res.status(500).json({ error: "Failed to count live" });
    }
});
/**end script for live**/
// recent activities
app.get("/api/recent-activity", auth, async (req, res) => {
    try {
        //from auth middleware
        const userId = req.user.id;

        const news = await News.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5);
        const events = await Events.find( { createdBy: userId } ).sort({ createdAt: -1 }).limit(5);
        const live = await Live.find( { createdBy: userId } ).sort({ createdAt: -1 }).limit(5);
        const ordinances = await Ordinance.find( { createdBy: userId } ).sort({ createdAt: -1 }).limit(5);
        const members = await Members.find( { createdBy: userId } ).sort({ createdAt: -1 }).limit(5);

        // Combine into a single array with type & date
        let activities = [];

        news.forEach(n => activities.push({ type: "news", message: n.title, date: n.createdAt }));
        events.forEach(e => activities.push({ type: "event", message: e.title, date: e.createdAt }));
        live.forEach(l => activities.push({ type: "live", message: l.title, date: l.createdAt }));
        ordinances.forEach(o => activities.push({ type: "ordinance", message: o.title, date: o.createdAt }));
        members.forEach(m => activities.push({ type: "members", message: m.name, date: m.createdAt }));

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
