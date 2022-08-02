const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
    examname: String,
    examtype: String,
    examdate: {
		type: Date,
		default: () => Date.now() + 7*24*60*60*1000,
	},
    exam: mongoose.Schema.Types.Mixed,
})

const Exam = mongoose.model('exam', examSchema)

module.exports = Exam