const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.email,
            pass: process.env.pass,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.email, // sender address
        to: email, // list of receivers
        subject: "OTP for grocery app", // Subject line
        text: otp, // plain text body
        html: `<b>${otp}</b>`, // html body
    });

    return info
}
module.exports = sendOtpEmail