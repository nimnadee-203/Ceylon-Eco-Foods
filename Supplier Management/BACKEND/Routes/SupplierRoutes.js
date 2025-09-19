const express = require('express');
const router = express.Router();
const SupplierController = require('../Controllers/SupplierControllers');
const auth = require('../middleware/auth');

router.post('/register', SupplierController.registerSupplier);
router.post('/login', SupplierController.loginSupplier);
router.post('/admin/login', SupplierController.adminLogin);
router.get('/', SupplierController.getSuppliers);
router.get('/profile', auth(['supplier']), SupplierController.getSupplierProfile);
router.get('/:id', SupplierController.getSupplierById);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

// Rating routes (admin only)
router.post('/:supplierId/rate', auth(['admin']), SupplierController.rateSupplier);
router.get('/:supplierId/ratings', auth(['admin']), SupplierController.getSupplierRatings);

module.exports = router;