const authController = require("../controller/authController");
const userController = require("../controller/userController");
const User = require("../model/userModel");
const express = require("express");
const {
  uploadUserPhoto,
  resizeUserPhoto,
  uploadPhotoToFirebase,
  uploadDoctorPdf,
  uploadPdfToFirebase,
} = require("../middlewares/file");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/:userId").get(userController.getSingleDoctor);

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

router.delete("/delete-all", async (req, res) => {
  await user.deleteMany({});
  res.send("deleted");
});
module.exports = router;
