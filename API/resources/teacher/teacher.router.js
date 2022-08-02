const express = require('express')

const controller = require('./teacher.controller')
const Teacher = require('./teacher.model')

const router = express.Router()

// -- /teacher
router.route('/')
    // .get(controller.getAllTeachers)
    // .get((req, res) => {
        // Teacher.find().then((result) => {
        //     console.log(result)
        //     res.send(result)
        // })
    // })
    .get(controller.getMany)
    // .post((req, res) => {
    //     console.log('got something' + res)
    //     res.json({name: 'aa', aa: 'bb'})
    // })
    .post(controller.createOne)

// -- /teacher/:id
router.route('/:id')
    .get(controller.getOne)
    .put(controller.updateOne)
    .delete(controller.deleteOne)

module.exports = router
