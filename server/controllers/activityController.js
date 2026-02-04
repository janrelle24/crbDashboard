const News = require("../model/news");
const Events = require("../model/events");
const Live = require("../model/live");
const Ordinance = require("../model/ordinance");
const Members = require("../model/members");

/*Recent Dashboard Activities */
exports.getRecentActivity = async (req, res) => {
    try {
        // From auth middleware
        const userId = req.user.id;

        // Fetch latest 5 from each module
        const news = await News.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5);

        const events = await Events.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5);

        const live = await Live.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5);

        const ordinances = await Ordinance.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5);

        const members = await Members.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5);

        /* Combine into one activity array */
        let activities = [];

        news.forEach((n) =>
        activities.push({
            type: "news",
            message: n.title,
            date: n.createdAt
        })
        );

        events.forEach((e) =>
        activities.push({
            type: "event",
            message: e.title,
            date: e.createdAt
        })
        );

        live.forEach((l) =>
        activities.push({
            type: "live",
            message: l.title,
            date: l.createdAt
        })
        );

        ordinances.forEach((o) =>
        activities.push({
            type: "ordinance",
            message: o.title,
            date: o.createdAt
        })
        );

        members.forEach((m) =>
        activities.push({
            type: "member",
            message: m.name,
            date: m.createdAt
        })
        );

        /* Sort newest first */
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        /* Send top 4 */
        res.json(activities.slice(0, 4));
    } catch (err) {
        console.error(err);
        res.status(500).json({
        error: "Failed to fetch recent activities"
        });
    }
};
