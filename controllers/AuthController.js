const otpGenerator = require('otp-generator');
const sendOtpEmail = require('../utils/nodemailer');
const User = require("../models/user")
const otps = require("../models/otps")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = {
    signup: async (req, res) => {
        try {
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
            const { email, password } = req.body
            // Check if user already exists with email or not
            const exists = await User.findOne({ email_address: email })

            if (exists) {
                return res.json({ msg: 'user already exists' })
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
            return res.json({ msg: 'OTP has been sent to your email address' })
        } catch (error) {
            return res.send({ msg: 'an error occured' })
        }
    },
    verifyOTP: async (req, res) => {
        try {
            const { otp, email } = req.body
            const otpDoc = await otps.findOne({ email_address: email })
            const userdoc = await User.findOne({ email_address: email })
            if (userdoc?.isVerified) {
                return res.send({ msg: 'otp has already been verified for this email' })
            }
            if (!otpDoc || !userdoc) {
                return res.send({ msg: 'Invalid otp for given email' })
            }
            if (otp !== otpDoc.otp)
                return res.send({ msg: 'Invalid otp' })
            else {
                await User.findByIdAndUpdate(userdoc.id, { isVerified: true })
                return res.send({ msg: 'otp verification successful' })
            }
        } catch (error) {
            console.log(error);
            return res.send({ msg: 'An orror occured' })
        }
    },
    regenerateOtp:async (req,res)=>{
       try{
           const {email}=req.body
           const otpDoc = await otps.findOne({ email_address: email })
           if (!otpDoc) {
               return res.send({ msg: 'Cannot regenerate otp for this email' })
           }
           //Generate new otp
           const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
           await otps.findOneAndUpdate({email_address: email}, { otp:otp })
           const info = await sendOtpEmail(email, otp)
           return res.send({msg:'New otp has been sent to your email address'})
       }catch (e) {
           console.log(e)
           res.send({msg:'An error occurrred'})
       }
    },
    signin: async (req, res) => {
        try {
            const {email,password}=req.body
            const user_doc=await User.findOne({email_address:email})
            if(!user_doc){
                return res.send({msg:'wrong email or password'})
            }
            if(!user_doc.isVerified){
                return res.send({msg:'email is not verified'})
            }
            const isPasswordCorrect=await bcrypt.compare(password,user_doc.password)
            if(!isPasswordCorrect){
                res.send({msg:'wrong email and password'})
            }
            const {email_address,id}=user_doc
            const token=jwt.sign({email_address,id},process.env.JWT_SECRET)
            return res.json({ user:{id,email_address},accesstoken:token })
        }catch (e) {
            console.log(e)
            return res.send({msg:"An error occurred.Try again "})
        }
    }
}

module.exports = Auth