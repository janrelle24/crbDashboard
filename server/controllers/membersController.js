const Members = require("../model/members");

/* Create Member */
exports.createMember = async (req, res) => {
    try {
        const member = await Members.create({
        image: req.file ? `/uploads/${req.file.filename}` : "",
        name: req.body.name,
        position: req.body.position,
        birthDate: req.body.birthDate,
        education: req.body.education,
        achievements: req.body.achievements,
        createdBy: req.user.id
        });

        res.status(201).json(member);
    } catch {
        res.status(500).json({ error: "Failed to save member" });
    }
};

/* Get Members */
exports.getMembers = async (req, res) => {
    try {
        const members = await Members.find({ createdBy: req.user.id })
        .sort({ createdAt: -1 });

        res.json(members);
    } catch {
        res.status(500).json({ error: "Failed to fetch members" });
    }
};

/* Delete Member */
exports.deleteMember = async (req, res) => {
    try {
        await Members.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id
        });

        res.json({ message: "Member deleted" });
    } catch {
        res.status(500).json({ error: "Failed to delete member" });
    }
};

/* Count Members */
exports.countMembers = async (req, res) => {
    try {
        const count = await Members.countDocuments({ createdBy: req.user.id });
        res.json({ count });
    } catch {
        res.status(500).json({ error: "Failed to count members" });
    }
};

/* Public Members */
exports.publicMembers = async (req, res) => {
    try {
        const members = await Members.find().sort({ createdAt: -1 });
        res.json(members);
    } catch {
        res.status(500).json({ error: "Failed to fetch public members" });
    }
};
/*get single members id */
exports.getSingleMember = async (req, res) => {
    try{
        const members = await Members.findById(req.params.id);
        res.json(members);
    } catch{
        res.status(500).json({ error: "Failed to fetch members item" });
    }
};