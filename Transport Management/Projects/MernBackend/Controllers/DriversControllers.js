const Driver = require("../Model/DriversModel");

// Get all drivers
const getAllDrivers = async (req, res, next) => {
  let drivers;
  try {
    drivers = await Driver.find();
  } catch (err) {
    console.log(err);
  }

  if (!drivers) {
    return res.status(404).json({ message: "Drivers not found" });
  }

  return res.status(200).json({ drivers });
};

// Add driver
const addDriver = async (req, res, next) => {
  const { name, licenseNumber, phone, address, email, status, hireDate, salary } = req.body;

  let driver;
  try {
    driver = new Driver({ name, licenseNumber, phone, address, email, status, hireDate, salary }); // ✅ email added
    await driver.save();
  } catch (err) {
    console.log(err);
  }

  if (!driver) {
    return res.status(404).json({ message: "Unable To Add Driver" });
  }

  return res.status(200).json({ driver });
};

// Get driver by ID
const getDriverById = async (req, res, next) => {
  const id = req.params.id;
  let driver;
  try {
    driver = await Driver.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  return res.status(200).json({ driver });
};

// Update driver
const updateDriver = async (req, res, next) => {
  const id = req.params.id;
  const { name, licenseNumber, phone, address, email, status, hireDate, salary } = req.body; // ✅ email added
  let driver;
  try {
    driver = await Driver.findByIdAndUpdate(
      id,
      { name, licenseNumber, phone, address, email, status, hireDate, salary }, // ✅ email added
      { new: true, runValidators: true }
    );
  } catch (err) {
    console.log(err);
  }

  if (!driver) {
    return res.status(404).json({ message: "Unable To Update Driver" });
  }

  return res.status(200).json({ driver });
};

// Delete driver
const deleteDriver = async (req, res, next) => {
  const id = req.params.id;
  let driver;
  try {
    driver = await Driver.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!driver) {
    return res.status(404).json({ message: "Unable To Delete Driver" });
  }

  return res.status(200).json({ message: "Driver Successfully Deleted" });
};

exports.getAllDrivers = getAllDrivers;
exports.addDriver = addDriver;
exports.getDriverById = getDriverById;
exports.updateDriver = updateDriver;
exports.deleteDriver = deleteDriver;
