const nodemailer = require("nodemailer");

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.fullName;
        this.url = url;
        this.from = "Outstagram with love";
    }

    createTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            service: process.env.EMAIL_SERVICE,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USERNAME, // sender email
                pass: process.env.EMAIL_PASSWORD, // sender email
            },
        });
    }

    async send(subject) {
        const mailOptions = {
            from: this.from, // sender address
            to: this.to, // list of receivers
            subject: subject, // Subject line
            // text: options.message, // plain text body
        };
        this.createTransport().sendMail(mailOptions);
    }

    async sendVerificationEmail() {
        await this.send("Email verification");
    }

    async sendResetPassword() {
        await this.send("Reset password");
    }
};
