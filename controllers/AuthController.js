const otpGenerator = require('otp-generator');
const sendOtpEmail = require('../utils/nodemailer');
const User = require("../models/user");
const otps = require("../models/otps");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Auth = {
    signup: async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) {
                return res.status(400).send({ msg: 'Provide email and password properly' }); // 400 Bad Request
            }

            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
            const { email, password } = req.body;

            // Check if user already exists with email or not
            const exists = await User.findOne({ email_address: email });

            if (exists) {
                return res.status(409).json({ msg: 'User already exists' }); // 409 Conflict
            }

            const hashed_password = await bcrypt.hash(password, 10);
            const user = new User({ email_address: email, password: hashed_password });
            const otp_doc = new otps({ email_address: email, otp });

            // Store the otp relative to email for verification and store the user in db
            await user.save();
            await otp_doc.save();

            // Send otp to email
            const info = await sendOtpEmail(email, otp);
            console.log("Message sent: %s", info);

            return res.status(201).json({ msg: 'OTP has been sent to your email address' }); // 201 Created
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: 'An error occurred' }); // 500 Internal Server Error
        }
    },
    verifyOTP: async (req, res) => {
        try {
            const { otp, email } = req.body;
            const otpDoc = await otps.findOne({ email_address: email });
            const userdoc = await User.findOne({ email_address: email });

            if (userdoc?.isVerified) {
                return res.status(400).send({ msg: 'OTP has already been verified for this email' }); // 400 Bad Request
            }

            if (!otpDoc || !userdoc) {
                return res.status(404).send({ msg: 'Invalid OTP for given email' }); // 404 Not Found
            }

            if (otp !== otpDoc.otp) {
                return res.status(401).send({ msg: 'Invalid OTP' }); // 401 Unauthorized
            } else {
                await User.findByIdAndUpdate(userdoc.id, { isVerified: true });
                return res.status(200).send({ msg: 'OTP verification successful' }); // 200 OK
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ msg: 'An error occurred' }); // 500 Internal Server Error
        }
    },
    regenerateOtp: async (req, res) => {
        try {
            const { email } = req.body;
            const otpDoc = await otps.findOne({ email_address: email });

            if (!otpDoc) {
                return res.status(404).send({ msg: 'Cannot regenerate OTP for this email' }); // 404 Not Found
            }

            // Generate new OTP
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
            await otps.findOneAndUpdate({ email_address: email }, { otp: otp });
            const info = await sendOtpEmail(email, otp);

            return res.status(200).send({ msg: 'New OTP has been sent to your email address' }); // 200 OK
        } catch (error) {
            console.log(error);
            return res.status(500).send({ msg: 'An error occurred' }); // 500 Internal Server Error
        }
    },
    signin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user_doc = await User.findOne({ email_address: email });
            // if no doc
            if (!user_doc) {
                return res.status(401).send({ msg: 'Wrong email or password' }); // 401 Unauthorized
            }

            if (!user_doc.isVerified) {
                return res.status(403).send({ msg: 'Email is not verified' }); // 403 Forbidden
            }

            const isPasswordCorrect = await bcrypt.compare(password, user_doc.password);

            if (!isPasswordCorrect) {
                return res.status(401).send({ msg: 'Wrong email or password' }); // 401 Unauthorized
            }

            const { email_address, id } = user_doc;
            const token = jwt.sign({ email_address, id }, process.env.JWT_SECRET, { expiresIn: '3600' });

            return res.status(200).json({ user: { id, email_address }, accessToken: token, expiresIn: 3600 }); // 200 OK
        } catch (error) {
            console.log(error);
            return res.status(500).send({ msg: "An error occurred. Try again" }); // 500 Internal Server Error
        }
    }
};

module.exports = Auth;
