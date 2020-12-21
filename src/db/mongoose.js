const mongoose = require('mongoose')


mongoose.connect(process.env.MONGOOSE_SERVER, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then((result) => console.log("connected to server"))
.catch((err) => console.log("error", err));
