const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['M', 'F']
    },
    photo: String,
    dob: Date,
    phone: String,
    email: String,
    emergencyname: String,
    emergencyphone: String,
    emergencyrelation: String,
    academicyear: Date,
    grade: {
        type: Number,
        enum: [9, 10]
    },
    classroom: String,
        // type: mongoose.SchemaTypes.ObjectId,
        // ref: 'class'
   /*  mark: {
        assignment: String,
        quiz: String,
        project: String,
        mid: String,
        final: String
    }, */
    username: String,
    password: String
})

const Student = mongoose.model('student', studentSchema)

module.exports = Student