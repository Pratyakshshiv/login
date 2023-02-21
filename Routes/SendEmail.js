const { response } = require("express");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const User = require("../Modals/UserData");
const Otp = require("../Modals/Otp");
const nodemailer = require("nodemailer");



router.post("/forgot-pass", async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const randomString = Math.floor(Math.random() * 10000 + 1);
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );

      sendEmail(userData.name, userData.email, randomString);
      res.status(200).send({ success: true, msg: "Check your mail" });
    } else {
      res.status(200).send({ success: true, msg: "Email does not exist" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});


const sendEmail = async (name, email, token) => {
  try {
    let transporter = nodemailer.createTransport({
      pool: true,
      service: "gmail",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "nodeotp@gmail.com", // generated ethereal user
        pass: process.env.GPass, // generated ethereal password
      },
    });

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const mailData = {
      from: "nodeotp@gmail.com",
      to: email,
      subject: "Otp for password change",
      text: "Hello world?", // plain text body
      html:
        "<p>Hii " + name + ", reset your password using this otp<p>" + token,
    };

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });

    
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};



module.exports = router;
