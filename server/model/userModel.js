const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  bloodGroup: {
    type: String,
    maxLength: [2, "Not a valid blood group"],
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  height: {
    type: String,
  },
  age: {
    type: String,
  },
  weight: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: [true, "This email already exists"],
  },
  password: {
    type: String,
    minLength: [6, "Password must have at least 6 characters"],
    select: false,
  },
  specialization: {
    type: [String],
  },
  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    default: "user",
  },
  treatmentArea: [
    {
      type: String,
      required: function () {
        return this.role === "doctor"; 
      },
    },
  ],
  pastExperience: {
    type: String,
    required: function () {
      return this.role === "doctor"; 
  },
},
experience:{
  type: String,
  required: function () {
    return this.role === "doctor"; 
},
},
  clinicLocation: {
    type: String,
    required: function () {
      return this.role === "doctor"; 
    },
  },
  clinicFee: {
    type: Number,
    required: function () {
      return this.role === "doctor"; 
    },
  },
  onlineFee: {
    type: Number,
    required: function () {
      return this.role === "doctor"; 
    },
  },
  reqs: [{ type: mongoose.Schema.ObjectId, ref: "DoctorInfo" }],
  status: {
    type: String,
    enum: ["Accepted", "Rejected", "In process"],
  },
  education: {
    type: String,
    required: function () {
      return this.role === "doctor"; // Education required only for doctors
    },
  },
  description: {
    type: String,
    required: function () {
      return this.role === "doctor"; // Education required only for doctors
    },
  },
  image: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/learning-63a18.appspot.com/o/users%2F21bed273-2706-4708-a35b-7d9bd0b8140e-1733399052578.jpeg?alt=media&token=b235cc0c-d341-4216-9e33-e95bded48224",
  },
  patientCount: {
    type: String,
    default: 0,
    required: function () {
      return this.role === "doctor"; // Patient count required for doctors
    },
  },
  nRating: {
    type: Number,
    default: 0,
  },
  avgRating: {
    type: Number,
    default: 0,
  }
});

// Virtual field for reviews
userSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "doctor",
  localField: "_id",
});
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Method for comparing passwords
userSchema.methods.isCorrectPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
// Post middleware to calculate ratings after finding a user
userSchema.post("findOne", async function (doc) {
  if (doc && doc.reviews && doc.reviews.length > 0) {
    doc.nRating = doc.reviews.length;
    doc.avgRating =
      doc.reviews.reduce((acc, review) => acc + review.rating, 0) /
      doc.reviews.length;
  } else if (doc) {
    doc.nRating = 0;
    doc.avgRating = 0;
  }
});

// Alternatively, use it with 'find' for multiple users
userSchema.post("find", async function (docs) {
  docs.forEach((doc) => {
    if (doc.reviews && doc.reviews.length > 0) {
      doc.nRating = doc.reviews.length;
      doc.avgRating =
        doc.reviews.reduce((acc, review) => acc + review.rating, 0) /
        doc.reviews.length;
    } else if (doc) {
      doc.nRating = 0;
      doc.avgRating = 0;
    }
  });
});

module.exports = mongoose.model("User", userSchema);
