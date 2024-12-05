const Review =require('../model/reviewModel');

exports.createReview=async(req,res,next)=>{
const {doctorId}=req.params;
const user=req.user._id;
const {text,rating}=req.body;
const review=await Review.create({doctor:doctorId,user,text,rating});

res.status(200).json({
    success:true,
    message:"Review created successfully",
    review
})
}

exports.getAllReviews=async(req,res,next)=>{
    const {doctorId}=req.params;
const reviews=await Review.find({doctor:doctorId});
res.status(200).json({
    success:true,
    length:reviews.length,
    reviews
})
}