const router = require("express").Router();
const validationJoiMiddleware = require("../middleware/validationJoi");
const employeeController = require("../controllers").employees;
const joiSchemeas = require("./../models/joiSchemas");
const {
  protectMiddleware,
  authorizeRolesRoutes,
} = require("./../middleware/authMiddleware");

const requestParserMiddleware = require("../middleware/requestParserMiddleware");

//Get all employees
router.get("", requestParserMiddleware, employeeController.showAllEmployees);
router.get("/view", requestParserMiddleware, employeeController.showEmployee);
router.post("/login", employeeController.loginEmployee);
router.post("", employeeController.createEmployee);
router.get("/:employeeId", employeeController.showEmployee);
router.post("/pendingReviews", employeeController.pendingReviews);
router.put("", employeeController.updateEmployee);
router.delete("", employeeController.deleteEmployee);
router.get("/assigned/:employeeId", employeeController.assignedReviews);

module.exports = router;
