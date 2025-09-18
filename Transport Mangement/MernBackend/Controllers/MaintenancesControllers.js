const Maintenance = require("../Model/MaintenancesModel");
const Driver = require("../Model/DriversModel");
const nodemailer = require("nodemailer");

// ✅ Nodemailer transporter (no .env for now)
// 👉 Replace with your Gmail + App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sheronkavinda2002@gmail.com",
    pass: "ebiiekpgaddvidnk"
  }
});

// Get all Maintenances
const getAllMaintenances = async (req, res) => {
  try {
    // populate driver (optional, helps frontend if you want driver details)
    const maintenances = await Maintenance.find().populate("driver");
    return res.status(200).json(maintenances);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while fetching maintenances" });
  }
};

// Add Maintenance + Send Email
const addMaintenance = async (req, res) => {
  const {
    vehicleNumber,
    type,
    description,
    cost,
    status,
    scheduledDate,
    completedDate,
    driverID // <- from frontend dropdown
  } = req.body;

  try {
    // 1) Create maintenance
    const maintenance = new Maintenance({
      vehicleNumber,
      type,
      description,
      cost,
      status,
      scheduledDate,
      completedDate,
      driver: driverID
    });
    await maintenance.save();

    // 2) Find driver & send email
    const driver = await Driver.findById(driverID);
    if (driver?.email) {
      const confirmLink = `http://localhost:5000/maintenances/confirm/${maintenance._id}`;

      await transporter.sendMail({
        from: '"Fleet System" <sheronkavinda2002@gmail.com>',
        to: driver.email,
        subject: "New Maintenance Assigned",
        html: `
          <h3>Dear ${driver.name},</h3>
          <p>A new <b>${type}</b> maintenance has been scheduled for vehicle <b>${vehicleNumber}</b>.</p>
          <p><b>Description:</b> ${description}</p>
          <p><b>Cost:</b> $${cost}</p>
          <p><b>Scheduled Date:</b> ${new Date(scheduledDate).toLocaleDateString()}</p>
          <p>Please confirm by clicking the link below:</p>
          <p><a href="${confirmLink}" target="_blank">✅ Confirm Maintenance</a></p>
        `
      });
    }

    return res.status(201).json(maintenance);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Unable To Add Maintenance" });
  }
};

// Get by ID
const getById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id).populate("driver");
    if (!maintenance) return res.status(404).json({ message: "Maintenance not found" });
    return res.status(200).json(maintenance);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update
const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!maintenance) return res.status(404).json({ message: "Maintenance not found" });
    return res.status(200).json(maintenance);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Unable To Update Maintenance" });
  }
};

// Delete
const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) return res.status(404).json({ message: "Maintenance not found" });
    return res.status(200).json({ message: "Maintenance Successfully Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Unable To Delete Maintenance" });
  }
};

// ✅ Confirm (email link / frontend button)
const confirmMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { confirmed: true },
      { new: true }
    );
    if (!maintenance) return res.status(404).send("Maintenance not found");

    return res
      .status(200)
      .send("<h2>✅ Maintenance confirmed successfully!</h2>");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error confirming maintenance" });
  }
};

exports.getAllMaintenances = getAllMaintenances;
exports.addMaintenance = addMaintenance;
exports.getById = getById;
exports.updateMaintenance = updateMaintenance;
exports.deleteMaintenance = deleteMaintenance;
exports.confirmMaintenance = confirmMaintenance;
