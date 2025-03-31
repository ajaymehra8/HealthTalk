const User = require("../model/userModel");
const Report = require("../model/reportModel");
const Email = require("../utils/email");

exports.createReport = async (req, res, next) => {
  const { doctorId, report } = req.body;
  const userId = req.user._id;
  try {
    const checkReport = await Report.findOne({
      user: userId,
      doctor: doctorId,
    });
    if (checkReport) {
      res.status(400).json({
        success: false,
        message: "One user can report only once",
      });
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
    return;
  }
  try {
    const reports = await Report.find({}).populate([
      { path: "doctor", select: "name email image" },
      { path: "user" },
    ]);
    res.status(200).json({
      success: true,
      length: reports.length,
      reports,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReport = async (req, res, next) => {
  if (req.user.role != "admin") {
    res.status(400).json({
      success: false,
      message: "You are not allowed for this action",
    });
    return;
  }
  try {
    const { report } = req.params;
    await Report.findByIdAndDelete(report);
    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
