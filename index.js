const express = require('express')
const app = express()

app.get("/", (req, res) => {
    res.send({ msg: 'welcome' }).status(200)
})
app.listen(9000, () => {
    console.log('server started');
})