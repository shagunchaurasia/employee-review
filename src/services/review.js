const reviewModel = require("./../models/review");
const employeeModel = require("./../models/employee");
const _ = require("lodash");

exports.fetchAllReviews = function (...args) {
  let { select, sort, queryString, limit, skip } = args[0].query;

  return new Promise(function (resolve, reject) {
    reviewModel
      .find()
      .select(select)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .then((reviewResponse) => {
        if (reviewResponse) {
          resolve(reviewResponse);
        } else ({});
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.fetchReview = function (reviewId) {
  return new Promise(function (resolve, reject) {
    reviewModel
      .find({ _id: reviewId })
      .then((reviewResponse) => {
        if (reviewResponse) {
          resolve(reviewResponse);
        } else {
          resolve({});
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.showReviewByEmployeeId = function (employeeId) {
  return new Promise(function (resolve, reject) {
    reviewModel
      .find({ employeeId: employeeId })
      .then((reviewEmployeeResponse) => {
        if (reviewEmployeeResponse) {
          resolve(reviewEmployeeResponse);
        } else {
          resolve({});
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.createReview = async function (data) {
  return new Promise((resolve, reject) => {
    let reviewData = new reviewModel({
      reviewTitle: data.reviewTitle,
      reviewDescription: data.reviewDescription,
      rating: data.rating,
      addedOn: Date.now(),
      employeeId: data.employeeId,
      addedByUserId: data.addedByEmployeeId,
      addedByUserName: data.addedByEmployeeName,
    });

    reviewData
      .save()
      .then((reviewResponse) => {
        //Add data to averageRating

        employeeModel.findOne({ _id: data.employeeId }).then((employeeData) => {
          let averageRating = employeeData.averageRating.concat(data.rating);

          employeeModel
            .findOneAndUpdate(
              { _id: data.employeeId },
              { $set: { averageRating: averageRating } }
            )
            .then((responseInner) => {
              resolve(responseInner);
            });
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateReview = function (data) {
  return new Promise((resolve, reject) => {
    let reviewData = {
      reviewTitle: data.reviewTitle,
      reviewDescription: data.reviewDescription,
      rating: data.rating,
      modifiedOn: Date.now(),
      modifiedBy: data.modifiedBy,
    };
    let query = { _id: data.reviewId };

    reviewModel
      .updateOne(query, reviewData, {
        upsert: false,
      })
      .then((reviewResponse) => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.deleteReview = function (data) {
  return new Promise((resolve, reject) => {
    reviewModel
      .deleteOne({ _id: data.reviewId })
      .then((reviewResponse) => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
