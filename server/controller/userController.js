const User = require("../model/userModel");
const storage = require("../config/firebase");
const Reqs = require("../model/doctorModel");
const Appoinment = require("../model/bookingModel");
exports.getAllDoctors = async (req, res) => {
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: "i" } }
    : {};
  const filter = req.query.filter;

  let doctors = [];
  if (filter === "rating") {
    doctors = await User.aggregate([
      { $match: { role: "doctor", ...keyword } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "doctor",
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0,
            },
          },
          nRating: { $size: "$reviews" }, // Count the number of reviews
        },
      },
      { $sort: { avgRating: -1 } }, // Sort by avgRating descending
      { $limit: 14 }, // Limit to 14 doctors
      {
        $project: {
          __v: 0,
          reviews: 0, // Optionally exclude reviews if not needed
        },
      },
    ]);

  } else if (filter === "price") {
    doctors = await User.find({ role: "doctor", ...keyword })
      .sort({ clinicFee: 1 })
      .limit(14)
      .select("-__v")
      .populate({ path: "reviews", options: { sort: { createdAt: -1 } } });
  } else if (filter === "location") {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    doctors = await User.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          spherical: true,
          maxDistance: 5000, // 5km radius (adjust as needed)
        },
      },
      { $match: { role: "doctor", ...keyword } },
      { $limit: 14 },
      { $project: { __v: 0 } },
    ]);
  } else {
    doctors = await User.find({ role: "doctor", ...keyword })
      .sort({ nRating: -1 })
      .limit(14)
      .select("-__v")
      .populate({ path: "reviews", options: { sort: { createdAt: -1 } } });

  }
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
  const { name, description, education, clinicFee  } = req.body;

  const field = Object.fromEntries(
    Object.entries({
      name,
      description,
      education,
      clinicFee,
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
    const reqs = await Reqs.find({}).populate({
      path: "user",
      select: "-password -__v",
    });
    res.status(200).json({
      success: true,
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

exports.getWebsiteDetails = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    const users = await User.find({ role: "user" });
    const totalUsers = await User.find();
    const appoinments = await Appoinment.find();
    const doneAppoinments = await Appoinment.find({ payment: true });
    res.status(200).json({
      success: true,
      doctors: doctors.length,
      users: users.length,
      totalUsers: totalUsers.length,
      appoinments: appoinments.length,
      payment: doneAppoinments?.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteDoctor=async(req,res)=>{
  if (req.user.role != "admin") {
      res.status(400).json({
        success: false,
        message: "Reports are only available to admin",
      });
      return;
    }
    try {
      const {doctor}=req.params;
      if(!doctor){
        res.status(400).json({
          success: false,
          message: "Select a doctor first.",
        });
        return;
      }
     await User.findByIdAndDelete(doctor);
      res.status(200).json({
        success: true,
        message:"Doctor deleted successfully",
      });
    } catch (err) {
      next(err);
    }
}
