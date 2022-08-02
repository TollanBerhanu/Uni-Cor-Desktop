const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true,
        enum: [9, 10]
    },
    section: String,
    classdescription: String
})

const Class = mongoose.model('class', classSchema)

module.exports = Class