const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  specialization: [
    {
      type: String,
      required: true
    },
  ],
  degree: {
    type: String,
    required:true
  },
  clinicLocation: {
    type: String,
    required:true
  },
  clinicFee: {
    type: Number,
    required:true
  },
  onlineFee: {
    type: Number,
    required: true
  },
 education: {
    type: String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  user:{
    type:mongoose.Schema.ObjectId,
    required:true,
    unique:[true,"You can only apply once"],
    ref:'User'
  }
});



module.exports = mongoose.model("DoctorInfo", userSchema);
