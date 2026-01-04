const mongoose = require('mongoose');
const { dashboardDB } = require("../config/db");
const Schema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }

});

module.exports = mongoose.model('News', Schema);