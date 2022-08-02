const controller = require('../controller/crud.controller')
const TeacherModel = require('./teacher.model')

module.exports = controller(TeacherModel)

// module.exports = {
//     ...controller(TeacherModel),
//     getOne() {

//     }
// }