const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const employeeSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: [true, "Please add an employee name"],
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    employeeEmail: {
      type: String,
      required: [true, "Please add an Email"],
      // match: [],
      unique: true,
    },
    hasAccess: {
      type: String,
      default: "false",
    },
    employeePhone: {
      type: String,
      required: [true, "Please add a number"],
      unique: true,
    },
    employeeAddress: {
      type: String,
      required: true,
    },
    employeePassword: {
      type: String,
      required: true,
      select: false,
    },
    employeeCity: {
      type: String,
      required: true,
    },
    employeeState: {
      type: String,
      required: true,
    },
    employeeDepartment: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Array,
    },
    addedOn: {
      type: Date,
      default: Date.now(),
    },
    addedByUserId: {
      // type: mongoose.Schema.ObjectId,
      // ref: "User",
      // required: true,
      type: String,
      required: true,
    },
    addedByUserName: {
      type: String,
    },
    modifiedOn: {
      type: Date,
      default: Date.now(),
    },
    modifiedBy: {
      type: String,
    },
    status: {
      type: Number,
    },
    pendingReviewsList: {
      type: [String],
    },
  },
  { collections: "employees" }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("employeePassword")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.employeePassword = await bcrypt.hash(this.employeePassword, salt);
});

employeeSchema.post("save", async function (next) {
  this.key = this._id;
});

//Sign JWT and return jwt token
employeeSchema.methods.getSignedJWTToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env[process.env.ENV + "_JWT_SECRET"],
    { expiresIn: process.env[process.env.ENV + "_JWT_EXPIRES"] }
  );
};

//Match password to hashed password in database
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.employeePassword);
};

//Generate and hash password token
employeeSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set reset password expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  //Return reset token to user to send mail
  return resetToken;
};

module.exports = mongoose.model("Employee", employeeSchema);
