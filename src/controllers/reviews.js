const { prepareResponse } = require("../util/responseParserUtility");
const reviewService = require("../services").review;
const asyncHandler = require("./../middleware/asyncMiddleware");
const errorHandlerUtility = require("./../util/errorHandlerUtility");

exports.showAllReviews = asyncHandler(async (request, response, next) => {
  let reviewData = await reviewService.showAllReviews(request.modifiedQuery);
  prepareResponse(response, reviewData, request.modifiedQuery);
});

exports.showReview = asyncHandler(async (request, response, next) => {
  let { reviewId } = request.query;
  if (!reviewId) {
    return next(new errorHandlerUtility("ReviewId not defined", 401));
  }

  let reviewData = await reviewService.fetchReview(reviewId);
  prepareResponse(response, reviewData);
});

exports.createReview = asyncHandler(async (request, response, next) => {
  let data = request.body;
  let createEmployeeReview = reviewService.createReview(data);
  let newReview = await createEmployeeReview;
  prepareResponse(response, newReview);
  next();
});

exports.showReviewForEmployee = asyncHandler(
  async (request, response, next) => {
    let { employeeId } = request.params;
    if (!employeeId) {
      return next(new errorHandlerUtility("EmployeeId not defined", 401));
    }

    let reviewData = await reviewService.showReviewByEmployeeId(employeeId);
    prepareResponse(response, reviewData);
  }
);

exports.updateReview = asyncHandler(async (request, response, next) => {
  let data = request.body;
  let updateReview = reviewService.updateReview(data);
  let employeeUpdated = await updateReview;
  prepareResponse(response, employeeUpdated);
});
