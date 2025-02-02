const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  specialization: {
    type: String,
  },
  treatmentArea: [
    {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
    },
  ],
  degree: {
    type: String,
    required: true,
  },
  clinicLocation: {
    type: String,
    required: true,
  },
  clinicFee: {
    type: Number,
    required: true,
  },
  onlineFee: {
    type: Number,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pastExperience: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
  experience: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: [true, "You can only apply once"],
    ref: "User",
  },
});

module.exports = mongoose.model("DoctorInfo", userSchema);
