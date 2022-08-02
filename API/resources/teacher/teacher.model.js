const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
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
        // required: true
    },
    photo: String,
    dob: Date,
    phone: String,
    email: String,
    emergencyname: String,
    emergencyphone: String,
    emergencyrelation: String,
    degree: String, 
    profession: String,
    subject: String,
    classes: Array,
    // grade9: Boolean,
    // grade10: Boolean,
    // contract: String,
    // shiftday: Boolean,
    // shiftnight: Boolean,
    homeroom: {
        type: String
        // type: mongoose.SchemaTypes.ObjectId
        // ref: 'class'
    },
    username: String,
    password: String
})

const Teacher = mongoose.model('teacher', teacherSchema)

module.exports = Teacher