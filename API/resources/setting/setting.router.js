const express = require('express')

const controller = require('./setting.controller')

const router = express.Router()

// -- /setting
router.route('/')
    .get(controller.getMany)
    .post(controller.createOne)

// -- /setting/:id
router.route('/:id')
    .get(controller.getOne)
    .put(controller.updateOne)
    .delete(controller.deleteOne)

module.exports = router