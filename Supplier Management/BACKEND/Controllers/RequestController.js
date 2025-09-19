const RequestModel = require('../Model/RequestModel');
const SubmissionModel = require('../Model/SubmissionModel');
const Supplier = require('../Model/SupplierModel');

/**
 * Admin: create a request
 * POST /Requests
 */
exports.createRequest = async (req, res) => {
  try {
    const { title, description, items, dueDate } = req.body;
    if (!title || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Title and items are required' });
    }

    const doc = new RequestModel({
      title,
      description,
      items,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdBy: req.user?.role === 'admin' ? undefined : req.user?.id
    });

    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error('createRequest error', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * List requests
 * GET /Requests
 */
exports.getRequests = async (req, res) => {
  try {
    const role = req.user?.role;
    let filter = {};
    if (role === 'supplier' || !role) {
      filter.status = { $in: ['open', 'partially_supplied'] };
    }
    const list = await RequestModel.find(filter).sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error('getRequests error', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Get single request
 * GET /Requests/:id
 */
exports.getRequestById = async (req, res) => {
  try {
    const doc = await RequestModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Request not found' });
    return res.json(doc);
  } catch (err) {
    console.error('getRequestById error', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Supplier: submit supply
 * POST /Requests/:id/submit
 */
exports.submitSupply = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { items, notes, supplierAmount } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    const request = await RequestModel.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (['supplied','closed'].includes(request.status)) {
      return res.status(400).json({ message: 'Request is not open for submissions' });
    }

    const submission = new SubmissionModel({
      request: requestId,
      supplier: req.user.id,
      items,
      notes,
      supplierAmount: supplierAmount || 0
    });
    await submission.save();

    // Update supplier's pending
    await Supplier.findByIdAndUpdate(req.user.id, {
      $inc: { pendingPayments: supplierAmount || 0 }
    });

    if (request.status === 'open') {
      request.status = 'partially_supplied';
      await request.save();
    }

    return res.status(201).json(submission);
  } catch (err) {
    console.error('submitSupply error', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Admin: list submissions for a request
 */
exports.getSubmissionsForRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const subs = await SubmissionModel.find({ request: requestId })
      .populate('supplier', '-password')
      .sort({ createdAt: -1 });
    return res.json(subs);
  } catch (err) {
    console.error('getSubmissionsForRequest error', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Admin: accept submission & pay supplier
 * POST /Requests/:id/submissions/:submissionId/accept
 */
exports.acceptSubmission = async (req, res) => {
  try {
    const { id: requestId, submissionId } = req.params;
    const { paidAmount } = req.body;

    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.status = 'accepted';
    submission.paidAmount = paidAmount || submission.supplierAmount;
    await submission.save();

    const supplier = await Supplier.findById(submission.supplier);
    if (supplier) {
      supplier.earnings += submission.paidAmount;
      supplier.pendingPayments -= submission.supplierAmount;
      if (supplier.pendingPayments < 0) supplier.pendingPayments = 0;
      await supplier.save();
    }

    const request = await RequestModel.findById(requestId);
    if (request) {
      request.status = 'supplied';
      await request.save();
    }

    return res.json({ message: 'Submission accepted and supplier paid', submission });
  } catch (err) {
    console.error('acceptSubmission error', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Optional endpoints
 * - GET /Requests/:id/submissions/:submissionId -> view single submission
 * - GET /Requests/submissions/mine -> supplier's own submissions
 */
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await SubmissionModel.findById(req.params.submissionId)
      .populate('supplier', '-password')
      .populate('request');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    return res.json(submission);
  } catch (err) {
    console.error('getSubmissionById error', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const subs = await SubmissionModel.find({ supplier: req.user.id })
      .populate('request')
      .sort({ createdAt: -1 });
    return res.json(subs);
  } catch (err) {
    console.error('getMySubmissions error', err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Admin: get all submissions across all requests
 * GET /Requests/submissions
 */
exports.getAllSubmissions = async (req, res) => {
  try {
    const subs = await SubmissionModel.find()
      .populate('request')
      .populate('supplier', '-password')
      .sort({ createdAt: -1 });
    return res.json(subs);
  } catch (err) {
    console.error('getAllSubmissions error', err);
    return res.status(500).json({ error: err.message });
  }
};
