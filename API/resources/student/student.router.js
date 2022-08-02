const express = require('express')

const controller = require('./student.controller')

const router = express.Router()

// -- /student
router.route('/')
    .get(controller.getMany)
    .post(controller.createOne)

// -- /student/:id
router.route('/:id')
    .get(controller.getOne)
    .put(controller.updateOne)
    .delete(controller.deleteOne)

module.exports = router