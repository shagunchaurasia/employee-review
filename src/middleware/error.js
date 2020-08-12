const errorHandlerUtility = require("./../util/errorHandlerUtility");

const errorHandler = (error, request, response, next) => {
  if (error.name == "MongoError" && error.code == 11000) {
    //Mongoose Duplicate Key
    const message = "Duplicate key with error message " + error.message;
    error = new errorHandlerUtility(message, 400);
  }

  //Resource not found error
  else if (error.name == "CastError") {
    const message = `Resource not found with ID of ${error.value}`;
    error = new errorHandlerUtility(message, 404);
  }

  //Mongoose validation error
  else if (error.name == "ValidationError") {
    const message = Object.values(error.errors).map((val) => val.message);
    error = new errorHandlerUtility(message, 400);
  }

  response.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
