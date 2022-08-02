const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    position: String,
    username: String,
    password: String
})

const Admin = mongoose.model('admin', adminSchema)

module.exports = Admin