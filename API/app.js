const express = require('express')
const { json, urlencoded } = require('body-parser')
const cors = require('cors')
const connection = require('./resources/db/connect')
// require('dotenv').config()

// const teacherRouter = require('./resources/teacher/teacher.router')
// const classRouter = require('./resources/class/class.router')
const studentRouter = require('./resources/student/student.router')
const scoreRouter = require('./resources/score/score.router')
const examRouter = require('./resources/exam/exam.router')
const settingRouter = require('./resources/setting/setting.router')

//Connect to MongoDB database
connection() 

const app = express()
const router = express.Router()

app.use(cors())
app.use(json({limit: '50mb'}))
app.use(urlencoded({ extended: true }))

app.use('/api', router)
app.get('/hello', (req, res) => {
  res.send('Hello from node')
})
// app.use('/teacher', teacherRouter)
// app.use('/class', classRouter)
app.use('/student', studentRouter)
app.use('/score', scoreRouter)
app.use('/exam', examRouter)
app.use('/setting', settingRouter)


app.listen(4000, () => {
    console.log('Server Running on Port 4000 ...')
})