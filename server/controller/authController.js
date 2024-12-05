const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const DoctorInfo = require("../model/doctorModel");

// jsonwebtoken code
const createToken = async (id) => {
  try {
    const token = jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw new Error("Failed to create token");
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
    const user = await User.create(req.body);
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
  console.log("login");
  let user = await User.findOne({ email }).select("-__v +password");
  console.log(user);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "There is no user with this email",
    });
  }

  try {
    if (await user.isCorrectPassword(password)) {
      if (user.role === "admin") {
        user = await User.findById(user._id)
          .select("-password ")
          .populate({
            path: "reqs",
            populate: { path: "user" }, // This will populate the user inside each req
          });
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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

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
    const user = req.user;
    const {
      education,
      experience,
      description,
      clinicLocation,
      specialization,
      clinicFee,
      onlineFee,
    } = req.body;
    const fields = {
      education,
      experience,
      description,
      clinicLocation,
      specialization,
      clinicFee,
      onlineFee,
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
    user.status = "In process";
    await user.save();
    // Optionally, you can also save the admin's updated document
    await admin.save();

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Your request send to admin successfully, wait for verification",
    });
  } catch (error) {
    // Handle errors and send a response
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateStatusByAdmin = async (req, res, next) => {
  const { userId, status, reqId } = req.body;
  const admin = req.user;
  if (status === "Rejected") {
    await DoctorInfo.findByIdAndDelete(reqId);
    await User.findByIdAndUpdate(userId, { status: null }, { new: true });
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
};
