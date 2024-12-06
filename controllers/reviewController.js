const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

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
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId; //  If tour is not provided, set it to the tour ID in the request URL
  if (!req.body.user) req.body.user = req.user.id; //  If user is not provided, set it to the user ID in the request object

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
