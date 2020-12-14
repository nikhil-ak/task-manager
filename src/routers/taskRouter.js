const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

// ?completed=true
// ?limit=10&skip=2
// ?sortBy=createdAt:desc
router.get('/task', auth, async (req,res) => {
    // Task.find({}).then((result) => res.status(200).send(result))
    // .catch((err) => res.status(400).send(err))
    const match ={}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1: 1
    }
    try {
        // const tasks = await Task.find({owner: req.user._id})
        // await req.user.populate('task').execPopulate()
        await req.user.populate({
            path: 'task',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        const tasks = req.user.task
        if(tasks.length==0) {
            return res.status(404).send("no tasks available")
        }
        res.status(200).send(tasks)
    }
    catch(err) {
        res.status(400).send(err)
    }
})

router.get('/task/:id', auth, async (req,res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)

    }
    catch(err) {
        res.status(400).send(err)
    }
   
})

router.post('/task', auth, async (req,res) => {
    // const newTask = new Task(req.body)
    const newTask = new Task({
        ...req.body, owner: req.user._id
    })
    try {
        await newTask.save()
        res.status(201).send(newTask)
    }
    catch(err) {
        res.status(400).send(err)
    }
})

router.patch('/task/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const validation = updates.every(e => {return allowedUpdates.includes(e)})
    if(!validation) {
        return res.status(400).send('please enter valid update keys')
    }

    try {
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body)
        const updatedTask = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!updatedTask) {
            return res.status(404).send("no tasks found")
        }
        updates.forEach(e => updatedTask[e] = req.body[e])
        await updatedTask.save()
        res.status(201).send(updatedTask)
    }
    catch(err) {
        res.status(400).send(err)
    }
 
})

router.delete('/task/:id', auth, async (req,res) => {
    try {
        // const deleteTask = await Task.findByIdAndDelete(req.params.id)
        const deleteTask = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!deleteTask) {
            return  res.status(404).send('no such task found')
        }
        res.status(200).send(deleteTask)
    }
    catch (err) {
        res.status(500).send(err)
    }
   
})

module.exports = router