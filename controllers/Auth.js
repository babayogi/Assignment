const User = require("../model/User");
// const OTP = require("../models/OTP");
// const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup
exports.signUp = async (req, res) => {
  try {
    // data fetch from req ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;

    // validate krlo
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2password match krlo(password,confirm)
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmed password does not match",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }
    /*
    // find most recent OTP stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // .sort({createdAt:-1}) -> This sorts the documents from the most recent to the oldest
    // .limit(1): This limits the number of documents returned to just one.
    console.log("recent otp", recentOtp);
    // validate OTP
    if (recentOtp.length == 0) {
      // otp not found
      return res.status(400).json({
        success: false,
        message: "otp not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      // invalid otp
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or OTP not matching",
      });
    }
*/
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create in db

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return res
    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered",
    });
  }
};
//--------------------------------->
// login
exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;

    // validate data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    // check for register user in db
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Verify password & generate a JWT token
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    if (await bcrypt.compare(password, user.password)) {
      // password match
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      //   user = user.toObject();
      user.token = token;
      user.password = undefined; // this is to do such that hacker cant hack it
      console.log(user);

    
      res.status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
    }

    // password not match
    else {
      return res.status(401).json({
        success: false,
        message: "Password does not match",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure",
    });
  }
};
