const mongoose =  require("mongoose");

const LiveSchema = new mongoose.Schema({
    title: { type: String, required: true },
    embedUrl: { type: String, required: true },
    status: { type: String, enum: ["LIVE", "OFFLINE"], default: "OFFLINE" },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Live", LiveSchema);