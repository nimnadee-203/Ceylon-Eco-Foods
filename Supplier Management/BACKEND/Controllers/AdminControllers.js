// BACKEND/Controllers/AdminControllers.js
const Admin = require("../Model/AdminModel");
const Supplier = require("../Model/SupplierModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Submission = require("../Model/SubmissionModel");

// Use env secret if provided, otherwise fallback (change before prod)
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_change_me";

/**
 * Register new Admin
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashed });
    await admin.save();

    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    console.error("registerAdmin error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Login Admin
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Admin login attempt:", { email, password: password ? "***" : "missing" });

    // create default admin if none exist
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log("Creating default admin...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const defaultAdmin = new Admin({
        name: "System Admin",
        email: "admin@system.local",
        password: hashedPassword,
      });
      await defaultAdmin.save();
      console.log("Default admin created");
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: admin._id.toString(), role: "admin", name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error("loginAdmin error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ------------------------------------------------------------------
   Supplier management (admin-only)
   ------------------------------------------------------------------ */

/**
 * List all suppliers with computed totals
 */
exports.listSuppliers = async (req, res) => {
  try {
    const Submission = require("../Model/SubmissionModel"); // adjust if path differs

    // Aggregate submissions by supplier
    const agg = await Submission.aggregate([
      {
        $project: {
          supplier: 1,
          status: 1,
          totalQty: {
            $reduce: {
              input: { $ifNull: ["$items", []] },
              initialValue: 0,
              in: { $add: ["$$value", { $ifNull: ["$$this.qty", 0] }] },
            },
          },
          totalValue: {
            $reduce: {
              input: { $ifNull: ["$items", []] },
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $multiply: [
                      { $ifNull: ["$$this.qty", 0] },
                      { $ifNull: ["$$this.price", 0] },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$supplier",
          totalOrders: { $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] } },
          totalItemsSupplied: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, "$totalQty", 0] },
          },
          earnings: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, "$totalValue", 0] },
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$totalValue", 0] },
          },
        },
      },
    ]);

    // Map totals by supplier
    const totalsBySupplier = agg.reduce((acc, row) => {
      acc[row._id.toString()] = {
        totalOrders: row.totalOrders,
        totalItemsSupplied: row.totalItemsSupplied,
        earnings: row.earnings,
        pendingPayments: row.pendingPayments,
      };
      return acc;
    }, {});

    // Fetch suppliers
    const suppliers = await Supplier.find().select("-password").sort({ createdAt: -1 });

    // Merge totals
    const result = suppliers.map((s) => {
      const id = s._id.toString();
      const totals = totalsBySupplier[id] || {
        totalOrders: 0,
        totalItemsSupplied: 0,
        earnings: 0,
        pendingPayments: 0,
      };
      return { ...s.toObject(), ...totals };
    });

    res.json(result);
  } catch (err) {
    console.error("listSuppliers error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get single supplier
 */
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).select("-password");
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    console.error("getSupplier error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create supplier (admin)
 */
exports.createSupplier = async (req, res) => {
  try {
    const { name, email, password, phone, address, company } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await Supplier.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const supplier = new Supplier({
      name,
      email,
      password: hashed,
      phone,
      address,
      company,
      role: "supplier",
    });

    await supplier.save();
    const out = supplier.toObject();
    delete out.password;
    res.status(201).json(out);
  } catch (err) {
    console.error("createSupplier error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update supplier (admin)
 */
exports.updateSupplier = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    console.error("updateSupplier error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Accept a submission and update supplier balances
 * Body: { paidAmount }
 */
exports.acceptSubmission = async (req, res) => {
  try {
    const { id } = req.params; // submission id
    const { paidAmount } = req.body;

    const submission = await Submission.findById(id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    if (submission.status === "accepted") {
      return res.status(400).json({ message: "Submission already accepted" });
    }

    // update submission
    submission.status = "accepted";
    submission.paidAmount = paidAmount || 0;
    await submission.save();

    // update supplier earnings & pendingPayments
    const supplier = await Supplier.findById(submission.supplier);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    supplier.earnings += submission.paidAmount;
    supplier.pendingPayments = Math.max(
      0,
      supplier.pendingPayments - submission.paidAmount
    );
    await supplier.save();

    res.json({ message: "Submission accepted", submission });
  } catch (err) {
    console.error("acceptSubmission error:", err);
    res.status(500).json({ error: err.message });
  }
};
/**
 * Delete supplier (admin)
 */
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // Optional cascade cleanup
    // const Submission = require("../Model/SubmissionModel");
    // await Submission.deleteMany({ supplier: req.params.id });

    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error("deleteSupplier error:", err);
    res.status(500).json({ error: err.message });
  }
};
