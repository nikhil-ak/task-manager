const express = require('express')
const userRoutes = require('./routers/userRouter')
const taskRoutes = require('./routers/taskRouter')

const { default: validator } = require('validator')


const app = express()

// const maintainance = (req,res,next) => {
//     res.status(503).send('site under maintainance')
// }

// app.use(maintainance)
app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)

module.exports = app