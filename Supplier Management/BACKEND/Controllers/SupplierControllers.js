const Supplier = require('../Model/SupplierModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple admin credentials (for demo). In production, move to ENV vars.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@system.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

// Register new supplier
exports.registerSupplier = async (req, res) => {
  try {
    const { name, email, password, phone, address, company } = req.body;
    const existing = await Supplier.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const supplier = new Supplier({ name, email, password: hashedPassword, phone, address, company });
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login supplier
exports.loginSupplier = async (req, res) => {
  try {
    const { email, password } = req.body;
    const supplier = await Supplier.findOne({ email });
    if (!supplier) return res.status(400).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Issue a token for suppliers as well for consistency
    const token = jwt.sign({ id: supplier._id.toString(), role: 'supplier', email: supplier.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: supplier._id.toString(), role: 'supplier', email: supplier.email, name: supplier.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin login (demo-only)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }
    const token = jwt.sign({ id: 'admin', role: 'admin', email }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token, user: { id: 'admin', role: 'admin', email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single supplier
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 // Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get supplier profile (for authenticated supplier)
exports.getSupplierProfile = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.user.id).select('-password');
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rate a supplier (admin only)
exports.rateSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    // Check if admin has already rated this supplier
    const existingRatingIndex = supplier.ratings.findIndex(
      r => r.ratedBy.toString() === req.user.id
    );

    const ratingData = {
      ratedBy: req.user.id,
      rating: rating,
      comment: comment || '',
      createdAt: new Date()
    };

    if (existingRatingIndex >= 0) {
      // Update existing rating
      supplier.ratings[existingRatingIndex] = ratingData;
    } else {
      // Add new rating
      supplier.ratings.push(ratingData);
    }

    // Calculate new average rating
    const totalRating = supplier.ratings.reduce((sum, r) => sum + r.rating, 0);
    supplier.rating = totalRating / supplier.ratings.length;
    supplier.ratingCount = supplier.ratings.length;

    await supplier.save();
    
    res.json({ 
      message: 'Rating updated successfully',
      rating: supplier.rating,
      ratingCount: supplier.ratingCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get supplier ratings (admin only)
exports.getSupplierRatings = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const supplier = await Supplier.findById(supplierId)
      .populate('ratings.ratedBy', 'name email')
      .select('ratings rating ratingCount');
    
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    
    res.json({
      rating: supplier.rating,
      ratingCount: supplier.ratingCount,
      ratings: supplier.ratings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
