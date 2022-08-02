const controller = require('../controller/crud.controller')
const StudentModel = require('./student.model')
const MarkModel = require('../mark/mark.model')

module.exports = {
    ...controller(StudentModel),
    // student/?class=9A
    async getMany(req, res) {
        try{
            var docs, data = []
            if(req.query.class){
                docs = await StudentModel.find({classroom: req.query.class}).exec()
            }
            else docs = await StudentModel.find().exec()
            if(req.user.type == 'teacher'){
                respond = new Promise((resolve, reject) => {
                    docs.forEach(async (student, i) => {
                        var sem1 = await MarkModel.findOne({
                            studentid: student._id,
                            grade: 9,
                            semester: 0,
                            subject: req.user.subject
                        }).exec()
                        var sem2 = await MarkModel.findOne({
                            studentid: student._id,
                            grade: student.grade,
                            semester: 1,
                            subject: req.user.subject
                        }).exec()
                        data[i] = {student, mark: [sem1, sem2]}
                        console.log('Log Info ... :  '+'\n'+sem1+'\n'+student._id+'\n'+student.grade+'\n'+req.user.subject)
                        // console.log('\nIn loop: ' + data[i].student.firstname + ' ' + data[i].student.lastname + ' ' + data[i].mark.grade9.semester1.english.assignment)
                    })
                    setTimeout(() => resolve(data), 2000)
                })
                respond.then(data => {
                    console.log('Data:' +JSON.stringify(data))
                    if(!docs) res.status(404).end()
                    res.status(200).json({ data: data })
                })
            }
            else res.status(200).json({ data: docs })
        }catch(err) { console.log('Error: ' + err) }
    }
}