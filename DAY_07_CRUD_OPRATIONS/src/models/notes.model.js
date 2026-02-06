// create schema and model for notes
const mongoose = require('mongoose');

// Create Schema - kon format a data will be stored
const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
});


// create Model - do any opation in database
const noteModel = mongoose.model('Notes', noteSchema);

module.exports = noteModel;
