const User = require("../model/userModel");
const Report = require("../model/reportModel");
const Email = require("../utils/email");

exports.createReport = async (req, res, next) => {
  const { doctorId, report } = req.body;
  const userId = req.user._id;
  try {
    const checkReport=await Report.findOne({user:userId,doctor:doctorId});
    if(checkReport){
      res.status(400).json({
        success:false,
        message:"One user can report only once"
      })
    }
    const newReport = await Report.create({
      report,
      user: userId,
      doctor: doctorId,
    });
    const doctor = await User.findById(doctorId);
    const email = new Email(req.user);
    email.report(doctor, req.user);
    res.status(200).json({
      success: true,
      message: "Reported doctor successfully.",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAllReports = async (req, res, next) => {
  if (req.user.role != "admin") {
    res.status(400).json({
      success: false,
      message: "Reports are only available to admin",
    });
  }
  try {
    const reports = await Report.find({});
    res.status(200).json({
      succcess: true,
      length: reports.length,
      reports,
    });
  } catch (err) {
    next(err);
  }
};
