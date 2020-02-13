const nodemailer = require("nodemailer");

const sendEmail = (email) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.emailUsername,
            pass: process.env.emailPassword
        },
        secure: true,
        pool: true
    });

    const message = {
        from: process.env.emailUsername,
        to: email,
        subject: "XYZ", // Subject line
        html: `
            <h1>Enter Here</h1>
        `
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            return;
        } else {
            console.log("Email Sent");
        }
    });
}

module.exports = sendEmail;