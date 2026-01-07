const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }

});

module.exports = mongoose.model('News', NewsSchema);