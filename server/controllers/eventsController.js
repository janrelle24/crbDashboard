const Events = require("../model/events");

/* Create Event */
exports.createEvent = async (req, res) => {
    try {
        const event = await Events.create({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        place: req.body.place,
        agenda: req.body.agenda,
        createdBy: req.user.id
        });

        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: "Failed to save event" });
    }
};

/* Get All Events */
exports.getEvents = async (req, res) => {
    try {
        const events = await Events.find({ createdBy: req.user.id })
        .sort({ date: -1 });

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
};

/* Update Event */
exports.updateEvent = async (req, res) => {
    try {
        const updated = await Events.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        req.body,
        { new: true }
        );

        if (!updated)
        return res.status(404).json({ message: "Event not found" });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update event" });
    }
};

/* Delete Event */
exports.deleteEvent = async (req, res) => {
    try {
        const deleted = await Events.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id
        });

        if (!deleted)
        return res.status(404).json({ message: "Event not found" });

        res.json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete event" });
    }
};

/* Count Events */
exports.countEvents = async (req, res) => {
    try {
        const count = await Events.countDocuments({ createdBy: req.user.id });
        res.json({ count });
    } catch {
        res.status(500).json({ error: "Failed to count events" });
    }
};

/* Public Events */
exports.publicEvents = async (req, res) => {
    try {
        const events = await Events.find().sort({ createdAt: -1 });
        res.json(events);
    } catch {
        res.status(500).json({ error: "Failed to fetch public events" });
    }
};
