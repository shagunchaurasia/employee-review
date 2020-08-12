const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewTitle: {
      type: String,
      required: [true, "Please add review title"],
      maxlength: 100,
    },
    reviewDescription: {
      type: String,
      required: [true, "Please add review "],
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating between 1 and 10"],
      min: 1,
      max: 10,
    },

    addedOn: {
      type: Date,
      default: Date.now(),
    },
    employeeId: {
      type: String,
    },
    addedByEmployeeId: {
      type: String,
    },
    addedByEmployeeName: {
      type: String,
    },
    modifiedOn: {
      type: Date,
      default: Date.now(),
    },
    modifiedBy: {
      type: String,
    },
  },
  { collections: "review" }
);

reviewSchema.index({ employeeId: 1, addedByUserId: 1 }, { unique: true });
module.exports = mongoose.model("review", reviewSchema);
