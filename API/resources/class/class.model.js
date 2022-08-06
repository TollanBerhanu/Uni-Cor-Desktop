const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    studentname: String,
    examname: String,
    score: Number
})

const Class = mongoose.model('class', classSchema)

module.exports = Class