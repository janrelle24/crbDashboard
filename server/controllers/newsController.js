const News = require("../model/news");

/* Create News */
exports.createNews = async (req, res) => {
    try {
        const news = await News.create({
        image: req.file ? `/uploads/${req.file.filename}` : "",
        title: req.body.title,
        content: req.body.content,
        createdBy: req.user.id
        });

        res.status(201).json(news);
    } catch (err) {
        res.status(500).json({ error: "Failed to create news" });
    }
};

/* Get All News (Admin Dashboard) */
exports.getNews = async (req, res) => {
    try {
        const news = await News.find({ createdBy: req.user.id })
        .sort({ createdAt: -1 });

        res.json(news);
    } catch {
        res.status(500).json({ error: "Failed to fetch news" });
    }
};

/* Delete News */
exports.deleteNews = async (req, res) => {
    try {
        await News.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id
        });

        res.json({ message: "News deleted successfully" });
    } catch {
        res.status(500).json({ error: "Failed to delete news" });
    }
};

/* Count News (Dashboard Stats) */
exports.countNews = async (req, res) => {
    try {
        const count = await News.countDocuments({
        createdBy: req.user.id
        });

        res.json({ count });
    } catch {
        res.status(500).json({ error: "Failed to count news" });
    }
};

/* Public News (Frontend Website) */
exports.publicNews = async (req, res) => {
    try {
        const news = await News.find()
        .sort({ createdAt: -1 });

        res.json(news);
    } catch {
        res.status(500).json({ error: "Failed to fetch public news" });
    }
};

/*get single news id */
exports.getSingleNews = async (req, res) => {
    try{
        const news = await News.findById(req.params.id);
        res.json(news);
    } catch{
        res.status(500).json({ error: "Failed to fetch news item" });
    }
};
