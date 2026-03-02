const mongoose = require('mongoose');

//Create a schema for notes
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

//Create a model for notes - Collection of same type of documents
let notemodel = mongoose.model('notes', noteSchema);

module.exports = notemodel;