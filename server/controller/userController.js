const User = require("../model/userModel");
const storage = require("../config/firebase");
const Reqs=require("../model/doctorModel");
const Appoinment=require("../model/bookingModel");
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

exports.getReqs = async (req, res) => {
  try {
    const reqs=await Reqs.find({}).populate({
      path:"user",
      select:"-password -__v"
    });
    res.status(200).json({
      success:true,
      message: "Request fetched successfully",
      reqs,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Unknown problem occurs",
    });
  }
};

exports.getWebsiteDetails=async(req,res)=>{
  try{
    const doctors=await User.find({role:"doctor"});
    const users=await User.find({role:"user"});
    const totalUsers=await User.find();
    const appoinments=await Appoinment.find();
    const doneAppoinments=await Appoinment.find({payment:true});
    res.status(200).json({
      success:true,
      doctors:doctors.length,
      users:users.length,
      totalUsers:totalUsers.length,
      appoinments:appoinments.length,
      payment:doneAppoinments?.length
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
}