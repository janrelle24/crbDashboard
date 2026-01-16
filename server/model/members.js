const mongoose = require('mongoose');

const MembersSchema = mongoose.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    birthDate: { type: Date, required: true},
    education: { type: String, required: true },
    achievements: { type: String, required: true },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Members', MembersSchema);