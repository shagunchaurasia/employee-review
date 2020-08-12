const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const MONGO_URL = process.env[process.env.ENV + "_MONGO_URL"];

const connectDB = async () => {
  const connection = await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  mongoose.set("debug", true);

  console.log(MONGO_URL.cyan.underline.bold);
  console.log(
    `Mongo DB Connected ${connection.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
