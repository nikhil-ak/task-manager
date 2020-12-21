const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { response } = require('express');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age:{
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('age should be positive number');
            }
            
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('invalid email format')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('enter valid password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// virtual attribute
userSchema.virtual('task', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// authentication
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    const isMatch = await bcrypt.compare(password, user.password)
    if(user && isMatch) {
        return user;
    }
    console.log('unable to login')
}

// password hashing
userSchema.pre('save', async function(next) {
    if(this.isModified('password'))
    this.password = await bcrypt.hash(this.password, 8)
    next()
})

// remove all tasks related to a user when the user is deleted

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

// authentication with jwt
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, process.env.SECRET_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// return user data without sending password and tokens fields

userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    return userObj
}

const User = mongoose.model('User', userSchema)



module.exports = User