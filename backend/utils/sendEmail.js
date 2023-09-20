const nodemailer=require('nodemailer');
const { options } = require('../routes/product_route');

const sendMail=async options=>{
    // nodemailer provided
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "bef2cd623522c8",
          pass: "a78193a4a2924d"
        }
    });
    // to verify all info is correct for nodmailer
    transporter.verify(function(error, success) {
        if (error) {
            console.error("Transporter verification failed:", error);
        } else {
            console.log("Transporter is ready to send emails");
        }
    });
    

    const message ={
        from:'Ecommerce <noreply@samanya.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    
    // used sendMail to send mail and put inside try and catch to check for error
    try {
        await transporter.sendMail(message); 
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email sending failed:", error);
    }


}

module.exports=sendMail;