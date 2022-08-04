const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    studentname: String,
    exam: mongoose.Schema.Types.Mixed
})

const Student = mongoose.model('student', studentSchema)

module.exports = Student