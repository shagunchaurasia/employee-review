const dotenv = require("dotenv").config();
module.exports = {
  ENV: process.env.ENV,
  PORT: process.env[process.env.ENV + "_PORT"],
};
