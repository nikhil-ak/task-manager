const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user

        next()
    }
    catch(err) {
        res.status(401).send('please authenticate')
    }
}

module.exports = auth