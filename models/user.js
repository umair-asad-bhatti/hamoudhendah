const mongoose = require("mongoose")
const schema = {}
const userSchema = new mongoose.Schema({
    ['First Name']: 'String'
})
const res = mongoose.model('Users', userSchema)
module.exports = res