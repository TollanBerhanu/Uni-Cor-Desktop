const express = require('express')

const controller = require('./exam.controller')

const router = express.Router()

// -- /exam
router.route('/')
    .get(controller.getMany)
    .post(controller.createOne)

// -- /exam/:id
router.route('/:id')
    .get(controller.getOne)
    .put(controller.updateOne)
    .delete(controller.deleteOne)

module.exports = router