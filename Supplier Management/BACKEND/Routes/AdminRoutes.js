// BACKEND/Routes/AdminRoutes.js
const express = require('express');
const router = express.Router();

const AdminController = require('../Controllers/AdminControllers');
const auth = require('../middleware/auth'); // function factory: auth([roles])
const adminCtrl = require("../Controllers/AdminControllers");

// Admin auth
router.post('/register', AdminController.registerAdmin);
router.post('/login', AdminController.loginAdmin);

// Supplier management (admin-only)
router.get('/suppliers', auth(['admin']), AdminController.listSuppliers);
router.get('/suppliers/:id', auth(['admin']), AdminController.getSupplier);
router.post('/suppliers', auth(['admin']), AdminController.createSupplier);
router.put('/suppliers/:id', auth(['admin']), AdminController.updateSupplier);
router.post("/submissions/:id/accept", adminCtrl.acceptSubmission);
router.delete('/suppliers/:id', auth(['admin']), AdminController.deleteSupplier);

module.exports = router;
