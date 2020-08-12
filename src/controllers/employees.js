const { prepareResponse } = require("../util/responseParserUtility");
const employeeService = require("../services").employee;
const asyncHandler = require("./../middleware/asyncMiddleware");
const errorHandlerUtility = require("./../util/errorHandlerUtility");

exports.showAllEmployees = asyncHandler(async (request, response, next) => {
  let employeeData = await employeeService.fetchAllEmployees(
    request.modifiedQuery
  );
  prepareResponse(response, employeeData, request.modifiedQuery);
});

exports.showEmployee = asyncHandler(async (request, response, next) => {
  let { employeeId } = request.query;
  if (!employeeId) {
    return next(new errorHandlerUtility("EmployeeId not defined", 401));
  }
  let employeeData = await employeeService.fetchEmployee(employeeId);
  prepareResponse(response, employeeData);
});

exports.createEmployee = asyncHandler(async (request, response, next) => {
  let data = request.body;
  let createEmployee = employeeService.createEmployee(data);
  let newEmployee = await createEmployee;
  prepareResponse(response, newEmployee);
  next();
});

exports.deleteEmployee = asyncHandler(async (request, response, next) => {
  let data = request.body;
  let deleteEmployee = await employeeService.deleteEmployee(data);
  prepareResponse(response, deleteEmployee);
});

exports.updateEmployee = asyncHandler(async (request, response, next) => {
  let data = request.body;
  let updateEmployee = employeeService.updateEmployee(data);
  let employeeUpdated = await updateEmployee;
  prepareResponse(response, employeeUpdated);
});

exports.loginEmployee = asyncHandler(async (request, response, next) => {
  let data = request.body;
  let employeeData = await employeeService.loginEmployee(data);

  if (typeof employeeData != "undefined") {
    sendTokenCookieResponse(employeeData, 200, response);
  } else {
    return next(new errorHandlerUtility("Invalid Credentials", 401));
  }
});

exports.pendingReviews = asyncHandler(async (request, response, next) => {
  let data = request.body;
  let employeeUpdated = await employeeService.addPendingReviews(data);
  prepareResponse(response, employeeUpdated);
  next();
});

const sendTokenCookieResponse = (employeeData, statusCode, response) => {
  const options = {
    expires: new Date(
      Date.now() +
        process.env[process.env.ENV + "JWT_COOKIE_EXPIRES_IN_MINUTES"] *
          60 *
          1000
    ),
    httpOnly: true,
    secure: true,
  };

  response
    .status(statusCode)
    .cookie("token", employeeData.token, options)
    .json({
      success: true,
      employeeData: employeeData,
      token: employeeData.token,
    });
};

exports.assignedReviews = asyncHandler(async (request, response, next) => {
  let { employeeId } = request.params;
  if (!employeeId) {
    return next(new errorHandlerUtility("EmployeeId not defined", 401));
  }

  let reviewData = await employeeService.showAssignedReviews(employeeId);
  prepareResponse(response, reviewData);
});
