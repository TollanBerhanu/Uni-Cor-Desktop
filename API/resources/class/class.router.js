const express = require('express')

const controller = require('./class.controller')

const router = express.Router()

// -- /class
router.route('/')
    .get(controller.getMany)
    .post(controller.createOne)

// -- /class/:id
router.route('/:id')
    .get(controller.getOne)
    .put(controller.updateOne)
    .delete(controller.deleteOne)

module.exports = router