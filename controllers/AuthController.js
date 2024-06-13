const otpGenerator = require('otp-generator');
const sendOtpEmail = require('../utils/nodemailer');
const User = require("../models/user")
const otps = require("../models/otps")
const bcrypt = require('bcrypt');
const Auth = {
    signup: async (req, res) => {
        try {
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
            const { email, password } = req.body
            // Check if user already exists with email or not
            const exists = await User.findOne({ email_address: email })

            if (exists) {
                return res.status(200).json({ msg: 'user already exists' })
            }
            const hashed_password = await bcrypt.hash(password, 10)
            const user = new User({ email_address: email, password: hashed_password })
            const otp_doc = new otps({ email_address: email, otp })
            // Store the otp relative to email for verification and store the user in db
            await user.save()
            await otp_doc.save()
            //send otp to email
            const info = await sendOtpEmail(email, otp)
            console.log("Message sent: %s", info);
            return res.status(200).json({ msg: 'OTP has been sent to your email address' })
        } catch (error) {
            return res.status(400).send({ msg: 'an error occured' })
        }
    },
    verifyOTP: async (req, res) => {
        try {
            const { otp, email } = req.body
            const otpDoc = await otps.findOne({ email_address: email })
            const userdoc = await User.findOne({ email_address: email })
            if (userdoc?.isVerified) {
                return res.status(400).send({ msg: 'otp has already been verified for this email' })
            }
            if (!otpDoc || !userdoc) {
                return res.status(400).send({ msg: 'Invalid otp for given email' })
            }
            if (otp != otpDoc.otp)
                return res.status(401).send({ msg: 'Invalid otp' })
            else {
                await User.findByIdAndUpdate(userdoc.id, { isVerified: true })
                return res.status(200).send({ msg: 'otp verification successful' })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ msg: 'An orror occured' })
        }
    },
    signin: async (req, res) => {
        res.status(200).json({ msg: 'signup  here' })
    }
}

module.exports = Auth