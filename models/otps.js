const mongoose = require("mongoose")
const otpSchema = new mongoose.Schema({
    email_address: String,
    otp: String
})
module.exports = mongoose.model('otps', otpSchema)
