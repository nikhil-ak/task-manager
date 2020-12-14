const express = require('express')
require('./db/mongoose.js')
const userRoutes = require('./routers/userRouter')
const taskRoutes = require('./routers/taskRouter')
const jwt = require('jsonwebtoken')

const { default: validator } = require('validator')

const port = process.env.PORT

const app = express()

// const maintainance = (req,res,next) => {
//     res.status(503).send('site under maintainance')
// }

// app.use(maintainance)
app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)


app.listen(port, () => {
    console.log("server running");
})


