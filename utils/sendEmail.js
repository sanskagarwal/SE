const nodemailer = require("nodemailer");

const sendEmail = (email,subject, msg) => {
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
        subject: subject, // Subject line
        html:`<p>${msg}</p>`
    };
    // transport.sendMail(message, function (err, info) {
    //     if (err) {
    //         return;
    //     } else {
    //         console.log("Email Sent");
    //     }
    // });
}

module.exports = sendEmail;