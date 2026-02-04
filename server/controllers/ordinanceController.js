const Ordinance = require("../model/ordinance");

/* Create Ordinance */
exports.createOrdinance = async (req, res) => {
    try {
        const ordinance = await Ordinance.create({
        ...req.body,
        createdBy: req.user.id
        });

        res.status(201).json(ordinance);
    } catch {
        res.status(500).json({ error: "Failed to save ordinance" });
    }
};

/* Get Ordinances */
exports.getOrdinances = async (req, res) => {
    try {
        const ordinances = await Ordinance.find({ createdBy: req.user.id })
        .sort({ createdAt: -1 });

        res.json(ordinances);
    } catch {
        res.status(500).json({ error: "Failed to fetch ordinances" });
    }
};

/* Delete Ordinance */
exports.deleteOrdinance = async (req, res) => {
    try {
        await Ordinance.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id
        });

        res.json({ message: "Ordinance deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete ordinance" });
    }
};

/* Count Ordinance */
exports.countOrdinance = async (req, res) => {
    try {
        const count = await Ordinance.countDocuments({ createdBy: req.user.id });
        res.json({ count });
    } catch {
        res.status(500).json({ error: "Failed to count ordinance" });
    }
};

/* Public Ordinances */
exports.publicOrdinance = async (req, res) => {
    try {
        const ordinances = await Ordinance.find().sort({ createdAt: -1 });
        res.json(ordinances);
    } catch {
        res.status(500).json({ error: "Failed to fetch public ordinances" });
    }
};
/*get single ordinance id */
exports.getSingleOrdinance = async (req, res) => {
    try{
        const ordinance = await Ordinance.findById(req.params.id);
        res.json(ordinance);
    } catch{
        res.status(500).json({ error: "Failed to fetch ordinance item" });
    }
};