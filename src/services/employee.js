const employeeModel = require("./../models/employee.js");
const reviewModel = require("./../models/review");
const _ = require("lodash");

exports.fetchAllEmployees = function (...args) {
  let { select, sort, queryString, limit, skip } = args[0].query;

  return new Promise(function (resolve, reject) {
    employeeModel
      .find({ role: { $ne: "admin" } })
      .select(select)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .then((employeeResponse) => {
        if (employeeResponse) {
          resolve(employeeResponse);
        } else ({});
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.fetchEmployee = function (employeeId) {
  return new Promise(function (resolve, reject) {
    employeeModel
      .find({ _id: employeeId })
      .then((employeeResponse) => {
        if (employeeResponse) {
          resolve(employeeResponse);
        } else {
          resolve({});
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.createEmployee = function (data) {
  return new Promise((resolve, reject) => {
    let employeeData = new employeeModel({
      employeeName: data.employeeName,
      employeeEmail: data.employeeEmail,
      employeePassword: data.employeePassword,
      employeeDepartment: data.employeeDepartment,
      employeeState: data.employeeState,
      employeeCity: data.employeeCity,
      employeeAddress: data.employeeAddress,
      hasAccess: data.hasAccess,
      employeePhone: data.employeePhone,
      addedOn: Date.now(),
      addedByUserId: data.addedByUserId ? data.addedByUserId : 1,
      addedByUserName: data.addedByUserName,
      status: data.status,
    });

    employeeData
      .save()
      .then((employeeResponse) => {
        let employeeResponseToSend = {
          token: employeeResponse.getSignedJWTToken(),
          employee: employeeResponse,
        };
        resolve(employeeResponseToSend);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateEmployee = function (data) {
  return new Promise((resolve, reject) => {
    let employeeId = data.employeeId;
    let employeeData = {
      employeeName: data.employeeName,
      employeeEmail: data.employeeEmail,
      employeePhone: data.employeePhone,
      employeeAddress: data.employeeAddress,
      employeeDepartment: data.employeeDepartment,
      employeeState: data.employeeState,
      employeeCity: data.employeeCity,
      modifiedOn: Date.now(),
      modifiedBy: data.modifiedBy,
    };

    let query = { _id: employeeId };

    employeeModel
      .updateOne(query, employeeData, {
        upsert: false,
      })
      .then((employeeResponse) => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.deleteEmployee = function (data) {
  return new Promise((resolve, reject) => {
    employeeModel
      .deleteOne({ _id: data.employeeId })
      .then((employeeResponse) => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.loginEmployee = (data) => {
  return new Promise(function (resolve, reject) {
    employeeModel
      .findOne({ employeeEmail: data.employeeEmail })
      .select("+employeePassword")
      .then(async (employeeResponse) => {
        let passwordMatch = await employeeResponse.matchPassword(
          data.employeePassword
        );
        if (passwordMatch) {
          let employeeDataToSend = {
            token: employeeResponse.getSignedJWTToken(),
            employee: employeeResponse,
          };
          resolve(employeeDataToSend);
        } else {
          resolve();
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.addPendingReviews = function (data) {
  return new Promise((resolve, reject) => {
    let employeeData = {
      pendingReviewsList: data.pendingReviewsList,
    };

    let query = { _id: data.employeeId };

    employeeModel
      .updateOne(query, employeeData, {
        upsert: false,
      })
      .then((employeeResponse) => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.showAssignedReviews = function (data) {
  return new Promise(function (resolve, reject) {
    employeeModel
      .find({ pendingReviewsList: { $in: data } })
      .then((reviewEmployeeResponse) => {
        //Login to find assigned reviews
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
