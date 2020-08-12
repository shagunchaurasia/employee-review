const router = require("express").Router();
const validationJoiMiddleware = require("../middleware/validationJoi");

const reviewsController = require("../controllers").reviews;
const joiSchemas = require("./../models/joiSchemas");
const {
  protectMiddleware,
  authorizeRolesRoutes,
} = require("./../middleware/authMiddleware");

const requestParserMiddleware = require("../middleware/requestParserMiddleware");
const asyncHandler = require("../middleware/asyncMiddleware");
const review = require("../models/review");

router.get("", requestParserMiddleware, reviewsController.showAllReviews);

router.get("/view", reviewsController.showReview);

router.post("", reviewsController.createReview);

router.get("/employee/:employeeId", reviewsController.showReviewForEmployee);

router.put("", reviewsController.updateReview);

module.exports = router;
