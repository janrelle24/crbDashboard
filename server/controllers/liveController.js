const Live = require("../model/live");

/* Create Live */
exports.createLive = async (req, res) => {
    try {
        const live = await Live.create({
        title: req.body.title,
        embedUrl: req.body.embedUrl,
        status: req.body.status || "OFFLINE",
        createdBy: req.user.id
        });

        res.status(201).json(live);
    } catch {
        res.status(500).json({ error: "Failed to save live" });
    }
};

/* Get Live */
exports.getLive = async (req, res) => {
    try {
        const live = await Live.find({ createdBy: req.user.id })
        .sort({ createdAt: -1 });

        res.json(live);
    } catch {
        res.status(500).json({ error: "Failed to fetch live" });
    }
};

/* Update Live */
exports.updateLive = async (req, res) => {
    try {
        const updated = await Live.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        req.body,
        { new: true }
        );

        if (!updated)
        return res.status(404).json({ message: "Live not found" });

        res.json(updated);
    } catch {
        res.status(500).json({ error: "Failed to update live" });
    }
};

/* Delete Live */
exports.deleteLive = async (req, res) => {
    try {
        await Live.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id
        });

        res.json({ message: "Live deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete live" });
    }
};

/* Count Live */
exports.countLive = async (req, res) => {
    try {
        const count = await Live.countDocuments({ createdBy: req.user.id });
        res.json({ count });
    } catch {
        res.status(500).json({ error: "Failed to count live" });
    }
};

/* Public Live */
exports.publicLive = async (req, res) => {
    try {
        const live = await Live.find().sort({ createdAt: -1 });
        res.json(live);
    } catch {
        res.status(500).json({ error: "Failed to fetch public live" });
    }
};
