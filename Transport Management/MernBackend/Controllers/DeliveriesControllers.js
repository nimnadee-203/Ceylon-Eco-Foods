const Deliveries = require("../Model/DeliveriesModel");

// ✅ Get All Deliveries
const getAllDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Deliveries.find();

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: "No deliveries found" });
    }

    // 🔥 Return array directly
    return res.status(200).json(deliveries);

  } catch (err) {
    console.error("Error fetching deliveries:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Add new Delivery
const addDeliveries = async (req, res, next) => {
  const { orderId, customerName, address, deliveriesDate, status } = req.body;

  try {
    const delivery = new Deliveries({
      orderId,
      customerName,
      address,
      deliveriesDate,
      status,
    });

    await delivery.save();

    return res.status(201).json(delivery);

  } catch (err) {
    console.error("Error adding delivery:", err);
    return res.status(500).json({ message: "Unable to add delivery" });
  }
};

// ✅ Get Delivery by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const delivery = await Deliveries.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    return res.status(200).json(delivery);

  } catch (err) {
    console.error("Error fetching delivery:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Delivery
const UpdateDeliveries = async (req, res, next) => {
  const id = req.params.id;
  const { orderId, customerName, address, deliveriesDate, status } = req.body;

  try {
    const delivery = await Deliveries.findByIdAndUpdate(
      id,
      { orderId, customerName, address, deliveriesDate, status },
      { new: true, runValidators: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Unable to update delivery" });
    }

    return res.status(200).json(delivery);

  } catch (err) {
    console.error("Error updating delivery:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Delivery
const deleteDeliveries = async (req, res, next) => {
  const id = req.params.id;

  try {
    const delivery = await Deliveries.findByIdAndDelete(id);

    if (!delivery) {
      return res.status(404).json({ message: "Unable to delete delivery" });
    }

    return res.status(200).json({ message: "Delivery deleted successfully" });

  } catch (err) {
    console.error("Error deleting delivery:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllDeliveries = getAllDeliveries;
exports.addDeliveries = addDeliveries;
exports.getById = getById;
exports.UpdateDeliveries = UpdateDeliveries;
exports.deleteDeliveries = deleteDeliveries;
