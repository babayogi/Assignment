const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student"],
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// handling email communications, such as user registration confirmation
// post middleware
userSchema.post("save", async function (doc) {
  try {
    console.log("Doc:", doc);

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "Yo",
      to: doc.email,
      subject: "handling email communication",
      html: `<h2>User Registered Suceesfully </p>`,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = mongoose.model("User", userSchema);
