const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/EmployeeController");

// CRUD
router.get("/", EmployeeController.getAllEmployees);
router.post("/", EmployeeController.addEmployee);
router.get("/:id", EmployeeController.getEmployeeById);
router.put("/:id", EmployeeController.updateEmployee);
router.delete("/:id", EmployeeController.deleteEmployee);

// Login route
router.post("/login", EmployeeController.loginEmployee);

module.exports = router;
