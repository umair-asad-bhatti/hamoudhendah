require('dotenv').config()
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const router = require("./router/Router")
const connectDB = require('./db/connect')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use("/api/v1/", router)
// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;
// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", async function () {
    await connectDB()
    console.log('Server is running...');
});