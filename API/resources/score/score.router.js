const express = require('express')

const controller = require('./score.controller')

const router = express.Router()

// -- /score
router.route('/')
    .get(controller.getMany)
    // .post(controller.createOne)
    .post(controller.scoreExam)
    .put(controller.updateOne)

// -- /score/:id
router.route('/:id')
    .get(controller.getOne)
    .put(controller.updateOne)
    .delete(controller.deleteOne)

module.exports = router