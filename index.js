const express = require('express')
const app = express()

app.get("/", (req, res) => {
    res.send({ msg: 'welcome' }).status(200)
})
// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
    console.log('running');
});