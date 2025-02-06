const Review = require("../model/reviewModel");

exports.createReview = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user._id;
  const { text, rating } = req.body;
  let review = await Review.findOne({ user, doctor: id });
  
  if (review) {
    res.status(200).json({
      success: false,
      message: "You can give only one review",
    });
    return;
  }
  review = await Review.create({ doctor: id, user, text, rating });

  res.status(200).json({
    success: true,
    message: "Review created successfully",
    review,
  });
};

exports.getAllReviews = async (req, res, next) => {
  const { id } = req.params;
  const reviews = await Review.find({ doctor: id }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    length: reviews.length,
    reviews,
  });
};

exports.getUserReview = async (req, res, next) => {
  let id = req.user._id;
 let populate="doctor";
 let field="user"
 if(req.user.role==="doctor"){
  populate="user";
  field="doctor"
 }
 
  const reviews = await Review.find({ [field]:id }).populate({
    path: populate,
    select: "-password -__v",
  }).sort({createdAt:-1});
  res.status(200).json({ success: true, reviews });
};
exports.deleteReview = async (req, res, next) => {
  const { id } = req.params;
  await Review.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};
