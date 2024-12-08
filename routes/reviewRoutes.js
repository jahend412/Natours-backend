const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const express = require('express');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo,
    reviewController.createReview,
  );

router.route('/:id').delete(
  // authController.protect,
  // authController.restrictTo,
  reviewController.deleteReview,
);
module.exports = router;
