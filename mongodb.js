const mongodb = require('mongodb')
const MongodbClient = mongodb.MongoClient;

const server = '/mongoDB/bin/mongod.exe --dbpath=/mongoDB-data'
// const id = new mongodb.ObjectID;
// console.log(id);

MongodbClient.connect(process.env.mongodbServer,{useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if(err) {
        return console.log("error:", err);
    }
    console.log("connection established");
    const db = client.db('taskManager')
    // db.collection('user').insertMany([{
    //     name: 'nikhil',
    //     age: 22
    // },
    // {
    //     name: 'sujith',
    //     age: 21
    // },
    // {
    //     name: 'sreehari',
    //     age: 20
    // }], (err, result) => {
    //     if(err) {
    //         return console.log("unable to add document user");
    //     }
    //     console.log(result.ops);
    // })
    // db.collection('tasks').insertMany([{
    //     description: 'this is task1',
    //     completed: true
    // },
    // {
    //     description: 'this is task2',
    //     completed: false   
    // },
    // {
    //     description: 'this is task3',
    //     completed: true   
    // }], (err, result) => {
    //     if(err) {
    //         return console.log("unable to add document task");
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('user').findOne({name:'sujith'}, (err,result) => {
    //     if(err) {
    //         return console.log("unable to perfrom find operation");
    //     }   
    //     console.log(result) 
    // })


    // db.collection('user').find({name:'nikhil'}).toArray((err,result) => {
    //     if(err) {
    //         return console.log("unable to perfrom find operation");
    //     }   
    //     console.log(result) 
    // })
    db.collection('tasks').updateMany({
        completed: false
    },
    {
        $set: {
            completed: true
        }
    })
    .then((result) => {console.log("updated", result.modifiedCount)})
    .catch((err) => {console.log("error", err)})
})