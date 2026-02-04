require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const ordinanceRoutes = require("./routes/ordinanceRoutes");
const membersRoutes = require("./routes/membersRoutes");
const liveRoutes = require("./routes/liveRoutes");
const activityRoutes = require("./routes/activityRoutes");
const publicRoutes = require("./routes/publicRoutes");


const app = express();

/* Connect MongoDB */
connectDB();

/* Middleware */
app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

/* Static Files */
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static("uploads"));

/* Routes */
app.use("/api", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/ordinance", ordinanceRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/live", liveRoutes);
app.use("/api", activityRoutes);
app.use("/api/public", publicRoutes);

module.exports = app;
