const ProductionRequest = require("../Model/ProductionRequestModel"); 
const MaterialStock = require("../Model/MaterialStockModel");

// Get all production requests
const getAllProductionRequests = async (req, res) => {
  try {
    const requests = await ProductionRequest.find();
    res.status(200).json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new production request
const addProductionRequest = async (req, res) => {
  const { RequestNo, Material, Quantity, RequestedBy, RequestedDate, RequirementCondition, Note } = req.body;

  try {
    const request = new ProductionRequest({
      RequestNo,
      Material,
      Quantity,
      RequestedBy,
      RequestedDate,
      RequirementCondition,
      Note,
      Status: "pending", // default status
    });

    await request.save();
    res.status(201).json({ request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update request status and deduct stock if approved
const updateRequestStatus = async (req, res) => {
  const id = req.params.id;
  const { Status } = req.body;

  try {
    const request = await ProductionRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only deduct stock if status is approved
    if (Status.toLowerCase() === "approved") {
      const materialStock = await MaterialStock.findOne({ productName: request.Material });

      if (!materialStock) {
        return res.status(404).json({ message: "Material stock not found" });
      }

      if (materialStock.totalQuantity < request.Quantity) {
        return res.status(400).json({ message: "Not enough stock!" });
      }

      materialStock.totalQuantity -= request.Quantity;
      await materialStock.save();
    }

    // Update status in the request
    request.Status = Status.toLowerCase();
    await request.save();

    res.status(200).json({ request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a production request
const deleteProductionRequest = async (req, res) => {
  const id = req.params.id;

  try {
    const request = await ProductionRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllProductionRequests,
  addProductionRequest,
  updateRequestStatus,
  deleteProductionRequest, // ✅ new
};


