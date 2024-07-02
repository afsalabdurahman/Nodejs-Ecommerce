const nodemailer = require("nodemailer");
const tsl=require("tls")
const tlsOptions = {
    rejectUnauthorized: false
};
sentVerificationMail=async(req,email)=>{
    otp=sentOtp()
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
   
    const mailer={
        from: 'afsalkp4343@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Verification code", // Subject line
    html: `<p>Hello , please enter this OTP: <strong>${otp}</strong> to verify your email.</p>`,
    }

informationMail= await transporter.sendMail(mailer)

}

sentOtp= ()=>{
    try {
        const otp=`${Math.floor(1000+Math.random()*9000)}`
        return otp
    } catch (error) {
        console.log(error)
    }
    }
     
  module.exports= {
  
    sentVerificationMail,
 
  }