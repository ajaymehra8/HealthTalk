const authController = require("../controller/authController");
const userController = require("../controller/userController");
const User = require("../model/userModel");
const passport = require("passport");
const express = require("express");
const {
  uploadUserPhoto,
  resizeUserPhoto,
  uploadPhotoToFirebase,
  uploadDoctorPdf,
  uploadPdfToFirebase,
} = require("../middlewares/file");
const router = express.Router();

//  GOOGLE AUTH
router.get("/google-auth", authController.googleLogin);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000",
  }),
 
);

router
  .route("/otp-verification")
  .get(authController.sendOtp)
  .post(authController.verifyOtp);
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router
  .route("/")
  .get(userController.getAllDoctors)
  .patch(
    authController.isProtect,
    uploadUserPhoto,
    resizeUserPhoto,
    uploadPhotoToFirebase,
    userController.updateUser
  );

router
  .route("/update-doctor")
  .patch(
    authController.isProtect,
    uploadUserPhoto,
    resizeUserPhoto,
    uploadPhotoToFirebase,
    userController.updateDoctor
  );
router
  .route("/requestToBecomeDoctor")
  .post(
    authController.isProtect,
    uploadDoctorPdf,
    uploadPdfToFirebase,
    authController.sendReqToBecomeDoctor
  );
router.post(
  "/update-status",
  authController.isAdmin,
  authController.updateStatusByAdmin
);
router.get(
  "/get-website-details",
  authController.isAdmin,
  userController.getWebsiteDetails
);
router.get("/request", authController.isAdmin, userController.getReqs);

router.route("/:userId").get(userController.getSingleDoctor);
router.delete("/doctor/:doctor",authController.isAdmin,   userController.deleteDoctor);
router.delete("/delete-all", async (req, res) => {
  await User.deleteMany({});
  res.send("deleted");
});
module.exports = router;
