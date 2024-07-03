// const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//     service:"gmail",
//   auth: {
//      user:'afsalkp4343@gmail.com',
//     pass:'sbrdylczdsizgozl',
// },
// });
// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
// otp=sentOtp();


//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: 'afsalkp4343@gmail.com', // sender address
//     to: "yijoy81647@joeroc.com", // list of receivers
//     subject: "Verification code", // Subject line
//     html: `<p>Hello , please enter this OTP: <strong>${otp}</strong> to verify your email.</p>`,
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }


module.exports=sentOtp= async ()=>{
  return new Promise((resolve, reject) => {
    
    const otp=`${Math.floor(1000+Math.random()*9000)}`
    resolve(otp)
  
  })

}  

// main()
    
//module.exports=main;
