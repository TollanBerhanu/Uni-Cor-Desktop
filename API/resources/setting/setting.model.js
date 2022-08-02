const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
    institutionName: String,
    institutionAbbr: String,
    faculty: String,
    department: String,
    courseName: String,
    courseCode: String,
    instructorName: String,
    prefix: String,
})

const Setting = mongoose.model('setting', settingSchema)

module.exports = Setting