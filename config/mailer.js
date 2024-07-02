const nodemailer = require("nodemailer");
const tsl=require("tls")
const tlsOptions = {
    rejectUnauthorized: false
};
const transporter = nodemailer.createTransport({
    service:"gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    
 
  auth: {
    user:process.env.authMail,
    pass:process.env.authPsw,

  },
  tls: tlsOptions

});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
otp=sentOtp();


  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'afsalkp4343@gmail.com', // sender address
    to: "yijoy81647@joeroc.com", // list of receivers
    subject: "Verification code", // Subject line
    html: `<p>Hello , please enter this OTP: <strong>${otp}</strong> to verify your email.</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

sentOtp= ()=>{
try {
    const otp=`${Math.floor(1000+Math.random()*9000)}`
    return otp
} catch (error) {
    console.log(error)
}
}


    
module.exports=main;
