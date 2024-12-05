const express=require("express");
const reviewController=require('../controller/reviewController');
const authController=require('../controller/authController');

const router=express.Router();
router.use(authController.isProtect);
router.route('/:doctorId').post(reviewController.createReview).get(reviewController.getAllReviews);

module.exports=router;
