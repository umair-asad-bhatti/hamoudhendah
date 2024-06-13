const otpGenerator = require('otp-generator');
const sendOtpEmail = require('../utils/nodemailer');
const Auth = {
    otp: '',
    email: '',
    password: '',
    signin: async (req, res) => {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
        const { email, password } = req.body
        this.email = email
        this.password = password
        this.otp = otp
        console.log(otp);
        //send otp to email
        const info = await sendOtpEmail(email, otp)
        console.log("Message sent: %s", info);
        res.status(200).json({ msg: 'login here' })
    },
    verifyOTP: (req, res) => {
        const { otp } = req.body
    },
    signup: async (req, res) => {
        res.status(200).json({ msg: 'signup  here' })
    }
}

module.exports = Auth