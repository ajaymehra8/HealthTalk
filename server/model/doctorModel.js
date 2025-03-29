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
    name: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  clinicFee: {
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

userSchema.index({ "clinicLocation.coordinates": "2dsphere" });


module.exports = mongoose.model("DoctorInfo", userSchema);
