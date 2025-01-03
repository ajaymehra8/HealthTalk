const User = require("../model/userModel");
const storage = require("../config/firebase");

exports.getAllDoctors = async (req, res) => {
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: "i" } }
    : {};

  const doctors = await User.find({ role: "doctor", ...keyword })
    .limit(12)
    .select("-__v")
    .populate({ path: "reviews", options: { sort: { createdAt: -1 } } });
  res.status(200).json({
    success: true,
    length: doctors.length,
    doctors,
  });
};

exports.getSingleDoctor = async (req, res, next) => {
  const { userId } = req.params;
  const doctor = await User.findById(userId).populate({
    path: "reviews",
    populate: {
      path: "user", // Populating the user field within reviews
      select: "name image id", // Selecting specific fields from the User model
    },
  });
  if (doctor.role != "doctor") {
    next("Not doctor");
  }
  res.status(200).json({
    success: true,
    doctor,
  });
};
// UPDATE USER

/*** DO THIS LATER ****/
// exports.updatePassword=async(req,res)=>{

// }

exports.updateDoctor = async (req, res) => {
  const { name, description, education, clinicFee, onlineFee } = req.body;

  const field = Object.fromEntries(
    Object.entries({
      name,
      description,
      education,
      clinicFee,
      onlineFee,
    }).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  if (req.file) {
    field.image = req.file.fileName;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, field, {
    new: true,
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
};

exports.updateUser = async (req, res) => {
  const { name, bloodGroup, age, height, weight } = req.body;

  const field = Object.fromEntries(
    Object.entries({ name, bloodGroup, age, height, weight }).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  if (req.file) {
    field.image = req.file.fileName;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, field, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
};
