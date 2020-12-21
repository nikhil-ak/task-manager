const app = require('./app')
require('./db/mongoose')

const port = process.env.PORT

app.listen(port, () => {
    console.log(`server running at ${port}`);
})


