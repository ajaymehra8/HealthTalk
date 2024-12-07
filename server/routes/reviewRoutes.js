const express = require("express");
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

const router = express.Router();
router.use(authController.isProtect);
router
  .route("/:id")
  .post(reviewController.createReview)
  .get(reviewController.getAllReviews)
  .delete(reviewController.deleteReview);
router.get("/", reviewController.getUserReview);
module.exports = router;
