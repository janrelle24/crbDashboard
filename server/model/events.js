const mongoose = require('mongoose');

const EventsSchema = mongoose.Schema({
    title: { type: String, required: true},
    date: { type: Date, required: true},
    time: { type: String, required: true},
    place: { type: String, required: true},
    agenda: { type: String, required: true}
});

module.exports = mongoose.model('Events', EventsSchema);