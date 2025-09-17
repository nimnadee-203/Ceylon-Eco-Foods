// BACKEND/Routes/RequestRoutes.js
const express = require('express');
const router = express.Router();
const RequestController = require('../Controllers/RequestController');
const auth = require('../middleware/auth'); // requires middleware/auth.js

// Admin creates a request
router.post('/', auth(['admin']), RequestController.createRequest);

// List requests (admin sees all, supplier sees open)
router.get('/', auth(), RequestController.getRequests);

// Supplier: get own submissions (must be before /:id route)
router.get('/submissions/mine', auth(['supplier']), RequestController.getMySubmissions);

// Admin: get all submissions (must be before /:id route)
router.get('/submissions', auth(['admin']), RequestController.getAllSubmissions);

// Get specific request
router.get('/:id', auth(), RequestController.getRequestById);

// Supplier submits supply for request
router.post('/:id/submit', auth(['supplier']), RequestController.submitSupply);

// Admin: get submissions for a request
router.get('/:id/submissions', auth(['admin']), RequestController.getSubmissionsForRequest);

// Admin accepts a submission
router.post('/:id/submissions/:submissionId/accept', auth(['admin']), RequestController.acceptSubmission);

// Optional: get one submission (admin or supplier who owns it)
router.get('/:id/submissions/:submissionId', auth(), RequestController.getSubmissionById);

module.exports = router;
