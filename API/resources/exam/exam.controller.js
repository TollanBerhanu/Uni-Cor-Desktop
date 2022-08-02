const controller = require('../controller/crud.controller')
const ExamModel = require('./exam.model')

module.exports = {
    ...controller(ExamModel),

    async getOne(req, res){
        try{
            // const doc = await model.findOne({_id: id, createdBy: req.user._id}).exec()
            console.log(req.params.id)
            var doc = await ExamModel.findOne({_id: '62e8ac0db5c01e43ba9d8172'}).exec()
            console.log(doc)
            // else doc = await model.findOne({_id: req.user._id}).exec()
            if(!doc) res.status(404).end()
            res.status(200).json({ data: doc })
        }catch(err) { console.log('Error getting exam: ' + err) }
    },

    async createOne(req, res){
        try{
            const data = {
                ...req.body,
                subject: req.user.subject
            }
            console.log(data)
            const doc = await ExamModel.create(data)
            if(!doc) res.status(404).end()
            res.status(200).json({ data: doc })
        }catch(err) { console.log('Error creating exam: ' + err) }
    },

    /* async getMany(req, res){
        try{
            // Look for exams that match the subject and any element in the classes array
            const docs = await ExamModel.find({subject: req.query.subject, classes: req.user.classroom}).exec()
            if(!docs) res.status(404).end()
            res.status(200).json({ data: docs })
        }catch(err) { console.log('Error retrieving exams: ' + err) }
    } */
}
