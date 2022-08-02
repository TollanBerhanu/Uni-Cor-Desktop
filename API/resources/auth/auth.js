const jwt = require('jsonwebtoken')
require('dotenv').config()

const Teacher = require('../teacher/teacher.model')
const Student = require('../student/student.model')
const Admin = require('../admin/admin.model')


const newToken = user => {
 return jwt.sign(user, process.env.TOKEN_SECRET)
//  return jwt.sign({ id: user._id }, process.env.TOKEN_SECRET)
}

const verifyToken = token => new Promise(
    (resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
            if(err) return reject(err)
            resolve(payload)
        })
    }
)

const createToken = async (req, res, next) => {
    var entity, entityType
    //Look for Teachers
    entity = await Teacher.findOne({username: req.body.username, password: req.body.password}).exec()
    if(entity) {
        req.user = newToken({ _id: entity._id, type: 'teacher', subject: entity.subject, grade9: entity.grade9, grade10: entity.grade10 })
        req.type = 'teacher'
        req.name = entity.firstname + ' ' + entity.lastname
        req.info = entity.subject
    }
    else {
        //Look for Students
        entity = await Student.findOne({username: req.body.username, password: req.body.password}).exec()
        if(entity) {
            req.user = newToken({_id: entity._id, type: 'student', classroom: entity.classroom})
            req.type = 'student'
            req.name = entity.firstname + ' ' + entity.lastname
            req.info = entity.classroom
        }
        else {
            //Look for Admins
            entity = await Admin.findOne({username: req.body.username, password: req.body.password}).exec()
            if(entity) {
                req.user = newToken({_id: entity._id, type: 'admin'})
                req.type = 'admin'
                req.name = entity.firstname + ' ' + entity.lastname
                req.info = entity.position
            }
        }
    }
    // console.log('Entity Type: ' + entityType + ' ' + entity + '\n' + newToken({entity, entityType}))
    if(!entity){
        res.send('Invalid Credentials!')
    }
    next()
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] // The token is kept on the request header
    const token = authHeader && authHeader.split(' ')[1] // if authHeader exists, get token from header "BEARER token" (Split on the space to get the token) else it's undefined
    if(token == null) return res.sendStatus(401)
    verifyToken(token).then(user => {
       req.user = user// Append the user object to req
       req.all = 'All'
       next()
    }).catch(err => console.log('Error while verifying token: ' + err))
}
/* 
console.log(process.env.TOKEN_SECRET)
console.log('JWT: ' + newToken({ _id: 'This is my user id' }))
verifyToken(newToken({hello: 'hello'})).then(res => console.log('Token: ' + res.hello))
 */
module.exports = {
    newToken,
    verifyToken,
    createToken,
    authenticateToken
}