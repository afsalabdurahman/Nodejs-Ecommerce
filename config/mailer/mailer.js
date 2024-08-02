const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'afsalkp4343@gmail.com',
        pass: process.env.password
    }
});

const mailOptions = {
    from: 'afsalkp4343@gmail.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'This is a test email'
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
