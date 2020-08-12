const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("./config/config");
const employeeRoutes = require("./routes/employeeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const mongoDBConnection = require("./config/database");
const colors = require("colors");
const errorHandler = require("./middleware/error");
var cookieParser = require("cookie-parser");
const helmet = require("helmet");
//Middleware logger for all requests
const morgan = require("morgan");
const cors = require("cors");
if (config.ENV == "DEV") {
  app.use(morgan("dev"));
}
//Connect to DB
mongoDBConnection();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());
app.use("/api/employee", employeeRoutes);
app.use("/api/review", reviewRoutes);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(
    `Server running on ${config.ENV} on port ${config.PORT}`.yellow.bold
  );
});

//Handle unhandled Rejections or promised rejections

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`.red.bold);
  //Close Server and exit process
  server.close(() => process.exit(1));
});
