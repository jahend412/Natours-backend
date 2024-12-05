const Review = mongoose.model('Review', reviewSchema);
const catchAsync = require('./utils/catchAsync');

// Review routes

// Get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find();

  res.status(200).json({
    status: 'success',
    results: review.length,
    data: {
      review,
    },
  });
});

// Create review
exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
