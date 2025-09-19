// routes/customer.js
const express = require("express");
const router = express.Router();
const SignupModel = require("../Model/SignupModel");

// List all customers with loyalty fields
router.get("/", async (req, res) => {
  try {
    const customers = await SignupModel.find({}, {
      fullName: 1,
      email: 1,
      totalOrders: 1,
      totalAmountSpent: 1,
      loyaltyTier: 1,
      loyaltyPoints: 1,
      totalDiscountReceived: 1,
      _id: 0
    });
    return res.json({ customers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get customer by email
router.get("/:email", async (req, res) => {
  try {
    const customer = await SignupModel.findOne({ email: req.params.email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update customer by email
router.put("/:email", async (req, res) => {
  try {
    const customer = await SignupModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true } // return updated doc
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
