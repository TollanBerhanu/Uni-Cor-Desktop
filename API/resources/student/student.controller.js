const controller = require('../controller/crud.controller')
const StudentModel = require('./student.model')

module.exports = {
    ...controller(StudentModel),

    async createOne(req, res){
        try{
            console.log(req.body);
            const doc = await StudentModel.create(req.body)
            if(!doc) res.status(404).end()
            console.log('Successfully registered student!')
            res.status(200).send({ data: doc })
        }catch(err) { console.log('Error getting exam: ' + err) }
    },
    
}