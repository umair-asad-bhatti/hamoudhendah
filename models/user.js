const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    email_address: { type: String, default: '' },
    password: { type: String, default: '' },
    username: { type: String, default: '' },
    first_name: { type: String, default: '' },
    last_name: { type: String, default: '' },
    dial_number: { type: Number, default: 0 },
    country_code: { type: String, default: '' },
    country_dial_code: { type: Number, default: 0 },
    phone_number: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
})
const res = mongoose.model('Users', userSchema)
module.exports = res