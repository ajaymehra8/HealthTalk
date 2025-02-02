const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const DoctorInfo = require("../model/doctorModel");
const crypto = require("crypto");
const Email = require("../utils/email");
const {oauth2client}=require("../config/googleOauth")
const axios=require('axios');
require("dotenv").config();
/* SOME HELPER FUNCTIONS USED IN CONTROLLER */
const dns = require("dns");

async function validateEmailDomain(req, res, email) {
  const domain = email.split("@")[1]; // Get the domain part
  if (!domain) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }

  try {
    const addresses = await dns.promises.resolveMx(domain); // Use promises to await
    if (!addresses || addresses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email",
      });
    } else {
      console.log(`Valid email domain: ${domain}`);
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }
}

// jsonwebtoken code
const createToken = async (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw new Error("Failed to create token");
  }
};

// GENERATE AN AUTHORIZED OTP
let otpStore = {};

// Function to generate a secure OTP (6 digits)
function generateOTP() {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    const digit = randomByte % 10;
    otp += digit.toString();
  }
  return otp;
}

// Function to create an OTP and store it with expiration time
function createOTP(email) {
  const otpS = generateOTP();
  const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
  otpStore[email] = { otpS, expiryTime };
  return otpS;
}

/* END OF HELPER FUNCTIONS USED IN CONTROLLER */

// send otp to user
exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exist",
      });
    }
    await validateEmailDomain(req, res, email);
    const otp = createOTP(email);
    const emailP = new Email({ email });
    emailP.sendOtp(otp);
    res.status(200).json({
      success: true,
      message: "OTP send successfully",
    });
  } catch (err) {
    next(err);
  }
};
//verify otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provid all credentials",
      });
    }
    const storedOtpData = otpStore[email];
    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found for this email",
      });
    }
    const { otpS, expiryTime } = storedOtpData;

    if (Date.now() > expiryTime) {
      delete otpStore[email]; // Remove expired OTP
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }
    if (otp !== otpS) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP, Please try again" });
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    next(err);
  }
};

// signup controller

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please provide all credentials",
      });
    }
    await validateEmailDomain(req, res, email);
    const user = await User.create(req.body);
    const emailP = new Email(user);
    emailP.sendWelcome().then(() => console.log("Welcome email sent!"));

    res.status(201).json({
      success: true,
      token: await createToken(user._id),
      user,
    });
  } catch (err) {
    next(err);
  }
};

// login controller

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email }).select("-__v +password");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "There is no user with this email",
    });
  }

  try {
    if (await user.isCorrectPassword(password)) {
      if (user.role === "admin") {
        user = await User.findById(user._id).select("-password -reqs");
      } else if (user.role === "doctor") {
        await User.findById(user._id).select("-password ");
      } else user = await User.findById(user._id).select("-password ");
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token: await createToken(user._id),

        user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Your password is incorrect",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Problem occur in login, Please try again later",
    });
  }
};

// isProtect middleware

exports.isProtect = async (req, res, next) => {
  // 1) Getting token and check if it's exist or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  console.log(token, "token");
  if (!token) {
    res.status(401).json({
      success: false,
      message: "You are not logged in , Please login!",
    });
  }
  // 2) Validate token / Verification of token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("The user is no longer exists", 401));
  }

  // 4) Check if the user changed the password after the JWT was issued
  // if (User.checkPasswordIsChanged(decoded.iat)) {
  //   return next(
  //     new AppError(
  //       'User recently changed their password, Please login again',
  //       401,
  //     ),
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  res.locals.user = user;
  next();
};

// isAdmin middleware

exports.isAdmin = async (req, res, next) => {
  // 1) Getting token and check if it's exist or not
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    token = req?.cookies?.jwt;
  }
  console.log(token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in , Please login!",
    });
  }

  // 2) Validate token / Verification of token

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("The user is no longer exists", 401));
  }
  // 4) Check user is admin or not
  if (!user.role === "admin") {
    return next(new AppError("The user is not admin", 400));
  }
  // 5) Check if the user changed the password after the JWT was issued
  // if (user.checkPasswordIsChanged(decoded.iat)) {
  //   return next(
  //     new AppError(
  //       'User recently changed their password, Please login again',
  //       401,
  //     ),
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  res.locals.user = user;
  next();
};

exports.sendReqToBecomeDoctor = async (req, res, next) => {
  try {
    let user = req.user;
    const {
      education,
      experience,
      pastExperience,
      description,
      clinicLocation,
      specialization,
      treatmentArea,
      clinicFee,
      onlineFee,
    } = req.body;
    let parsedTreatmentArea;
    try {
      parsedTreatmentArea = JSON.parse(treatmentArea);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid treatment areas format. Expected an array.",
      });
    }
    if (!Array.isArray(parsedTreatmentArea)) {
      return res.status(400).json({
        success: false,
        message: "Treatment areas must be an array.",
      });
    }
    const fields = {
      education,
      experience,
      description,
      clinicLocation,
      treatmentArea: parsedTreatmentArea,
      specialization,
      clinicFee,
      onlineFee,
      pastExperience,
      user: user._id,
    };

    if (req.file) {
      fields.degree = req.file.fileName;
    }
    const isAlreadyApplied = await DoctorInfo.findOne({
      user: fields.user,
    });
    if (isAlreadyApplied) {
      return res.status(200).json({
        success: false,
        message: "You application is already submitted",
        subMessage: "Please wait for response from our side.",
      });
    }
    const userDocs = await DoctorInfo.create(fields);
    // Find the admin user
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Push the user ID into the admin's reqs array
    admin.reqs.push(userDocs._id); // Assuming user is an object and _id is the user ID
    user = await User.findById(user._id);

    user.status = "In process";
    await user.save();
    // Optionally, you can also save the admin's updated document
    await admin.save();

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Your request send to admin successfully, wait for verification",
      user,
    });
  } catch (error) {
    // Handle errors and send a response
    console.log("here there");
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateStatusByAdmin = async (req, res, next) => {
  try {
    const { userId, status, reqId } = req.body;
    const admin = req.user;
    console.log(status);
    if (status === "Rejected") {
      await User.findByIdAndUpdate(userId, { status: null }, { new: true });
      await DoctorInfo.findByIdAndDelete(reqId);

      //SEND MESSAGE TO USER THAT HIS APPLICATION IS REJECTED
      return res.status(200).json({
        success: true,
        message: "Application rejected successfully",
      });
    }
    if (status == "Accepted") {
      const extraInfos = await DoctorInfo.findById(reqId);
      const {
        specialization,
        degree,
        clinicFee,
        clinicLocation,
        education,
        description,
        onlineFee,
      } = extraInfos;
      await User.findByIdAndUpdate(
        userId,
        {
          specialization,
          degree,
          clinicFee,
          clinicLocation,
          onlineFee,
          education,
          description,
          role: "doctor",
          status: null,
        },
        { new: true }
      );
      // SEND MESSAGE TO USER THAT NOW HE IS DOCTOR

      //Here i want to update admin
      // Remove the reqId from the admin's reqs array
      await User.findByIdAndUpdate(
        admin._id,
        { $pull: { reqs: reqId } }, // This removes the reqId from the reqs array
        { new: true }
      );
      await DoctorInfo.findByIdAndDelete(reqId);
      //SEND MESSAGE TO USER THAT NOW HE IS A DOCTOR
      return res.status(200).json({
        success: true,
        message: "Application accepted and user updated to doctor",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// GOOGLE AUTHENTICATION
exports.googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const {email,name,picture}=userRes.data;
    let user=await User.findOne({email});
    if(!user){
      user=await User.create({email,name,image:picture});
    }
    const token=await createToken(user._id);
    res.status(201).json({
      success:true,
      user,
      jwt,
      message:'Login successfully'
    }
    )
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
