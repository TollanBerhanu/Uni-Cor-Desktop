const controller = require('../controller/crud.controller')
const SettingModel = require('./setting.model')

module.exports = controller(SettingModel)
