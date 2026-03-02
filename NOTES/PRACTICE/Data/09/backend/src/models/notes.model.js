const mongoose = require('mongoose')

const newSchema = new mongoose.Schema({
    title:String,
    content:String
})

const noteModel = mongoose.model('notes', newSchema)

module.exports = noteModel