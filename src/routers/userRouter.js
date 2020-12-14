const express = require('express')
const sharp = require('sharp')
const router = new express.Router()
const {sendWelcomeEmail, sendFarewellEmail}  = require('../emails/account')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')

var upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        // if(!file.originalname.endsWith('.png')) {
        //     return callback(new Error("Please upload an image file"))
        // }
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return callback(new Error("Please upload an image file"))
        }
        callback(undefined, true)
    }
})

router.post('/user/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    // req.user.avatar = req.file.buffer
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})

router.delete('/user/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/user/:id/avatar', async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error("no user found")
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    }
    catch(err) {
        res.status(400).send(err)
    }

})
// router.get('/user', (req,res) => {
//     User.find({}).then((result) => res.status(200).send(result))
//     .catch((err) => res.status(400).send(err))
// })

// router.get('/user', async (req,res) => {
//     try {
//         const users = await User.find({})
//         res.status(200).send(users)
//     }
//     catch (err){
//         res.status(400).send(err)
//     }
// })
router.get('/user/me', auth, async (req,res) => {
    res.status(200).send(req.user)
})

// router.get('/user/:id', (req,res) => {
//     const _id = req.params.id;
//     console.log(_id);
//     User.findById(_id).then((result) =>{
//         if(!result) {
//             return res.status(404).send()
//         }
//         res.status(200).send(result)
//     })
//     .catch((err) => res.status(400).send(err))
// })

// router.get('/user/:id', async (req,res) => {
//     const _id = req.params.id;
//     console.log(_id);
//     try {
//         const user = await User.findById(_id)
//         console.log(user);
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.status(200).send(user)
//     }
//     catch (err){
//         res.status(400).send(err)
//     }
// })

// router.post('/user', (req,res) => {
//     const newUser = new User(req.body).save().then((result) => res.status(201).send(result))
//     .catch((err) => res.status(400).send("error", err))
// })

router.post('/user', async (req,res) => {
    try {
        const newUser = await new User(req.body)
        await newUser.save()
        sendWelcomeEmail(newUser.email, newUser.name)
        const token = await newUser.generateAuthToken();
        res.status(201).send({newUser, token})
    }
    catch(err) {
        res.status(400).send(err)
    }
})


router.patch('/user/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const validation = updates.every(e => {return allowedUpdates.includes(e)})
    if(!validation) {
        return res.status(400).send('please enter valid update keys')
    }

    try {
        // const updateUser = await User.findById(req.params.id);
        const updateUser = req.user;
        updates.forEach(e => updateUser[e] = req.body[e])
        await updateUser.save()
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body)
        // if(!updateUser) {
        //     return res.status(404).send("no tasks found")
        // }
        res.status(201).send(updateUser)
    }
    catch(err) {
        res.status(400).send()
    }
 
})
router.delete('/user/me', auth, async (req,res) => {
    try {
        // const deleteUser = await User.findByIdAndDelete(req.params.id)
        // if(!deleteUser) {
        //     return  res.status(404).send('no such user found')
        await req.user.remove()
        sendFarewellEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
        }
    catch (err) {
        res.status(500).send(err)
    }
   
})

// login route
router.post('/user/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken();
        res.status(200).send({user, token})
    }
    catch(err) {
        res.status(400).send(err)
    }
})

// logout route

router.post('/user/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter(e => e.token !== req.token)
        await req.user.save()
        res.status(200).send()
    }
    catch(err) {
        res.status(400).send(err)
    }
})

// logoutall routes
router.post('/user/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }
    catch(err) {
        res.status(400).send(err)
    }
})

module.exports = router