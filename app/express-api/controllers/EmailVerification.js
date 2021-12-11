const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const {UserEmailVerificationModel} = require("../models/UserEmailVerificationModel");
const {encrypt} = require("../utils/crypto");
const path = require("path");

dotenv.config();


class EmailVerification {
    constructor() {
        this.transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT), auth: {
                user: process.env.SMTP_AUTH_USER, pass: process.env.SMTP_AUTH_PASS
            }
        })
    }

    async isEmailVerified(req, res, next) {
        const email = req.params.email
        const found = await UserEmailVerificationModel.findOne({email})
        console.log('found: ', found)
        if (!found) return res.send({isSuccess: true, isVerified: false})
        if (!found.isVerified) return res.send({isSuccess: true, isVerified: false})
        return res.send({isSuccess: true, isVerified: true})
    }

    async sendEmailVerification(req, res, next) {
        const email = req.params.email;
        const token = this.generateToken(20);
        const hash = encrypt(token)
        const link = `http://localhost:8080/api/email/check-email-verification/${token}`
        const found = await UserEmailVerificationModel.findOne({email})
        if (found !== null) {
            // email exists
            console.log('found: ', found)
            if (found.isVerified) return res.send({isSuccess: true, message: `email ${email} is already verified`})
            return res.send({
                isSuccess: true, message: `the email with the verification link has been already send to ${email}`
            })
        } else {
            // new email address
            const insertRecord = {email, token: hash, isVerified: false}
            const userEmailVerificationRecord = new UserEmailVerificationModel(insertRecord);
            userEmailVerificationRecord.save(err => {
                if (err) return res.send(500).json({isSuccess: false, error: err.message})
                // send email
                this.transport.sendMail({
                    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_AUTH_USER}>"`,
                    to: email,
                    subject: 'SBT app - Verification',
                    html: `
                        <div>
                            <h1>SBT app - verification</h1>
                            <br>
                            <a href="${link}">Click here to verify your email</a>
                        </div>
                        `
                }).then(info => {
                    console.log(info.messageId)
                    res.send({
                        isSuccess: true,
                        message: `verification link was send to: ${email}, refresh the page after verification`
                    })
                }).catch(err => {
                    console.error(err.message)
                    res.send({isSuccess: false, err: err.message})
                })
            })
        }
    }

    async checkEmailToken(req, res, next) {
        const token = req.params.token;
        const hash = encrypt(token)
        const found = await UserEmailVerificationModel.findOne({token: hash})
        if (!found) return res.send({
            isSuccess: false, message: 'please resend the verification email, an error has occurred :('
        })
        console.log('checkEmailToken found: ', found)
        if (found.isVerified) return res.send({isSuccess: true, message: 'email address is already verified!'})
        // successfully verified then
        found.isVerified = true
        await found.save();
        return res.sendFile(path.join(__dirname, '..', 'static', 'email-verification.html'))
    }

    generateToken(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

module.exports = EmailVerification