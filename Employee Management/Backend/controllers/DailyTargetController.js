const mongoose = require("mongoose");
const DailyTarget = require("../Model/DailyTargetModel");

// Get all daily targets
const getAllDailyTargets = async (req, res) => {
    try {
        const targets = await DailyTarget.find();
        if (!targets.length) {
            return res.status(404).json({ message: "No daily targets found" });
        }
        return res.status(200).json({ targets });
    } catch (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
    }
};

// Add new daily target
const addDailyTarget = async (req, res) => {
    const { targetDate, productName, targetQuantity, achievedQuantity, status, employee, remarks } = req.body;

    try {
        const target = new DailyTarget({
            targetDate, productName, targetQuantity, achievedQuantity, status, employee, remarks
        });
        await target.save();
        return res.status(201).json({ target });
    } catch (err) {
        return res.status(400).json({ message: "Unable to add daily target", error: err.message });
    }
};

// Get by ID
const getbyid = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const target = await DailyTarget.findById(id);
        if (!target) {
            return res.status(404).json({ message: "Daily target not found" });
        }
        return res.status(200).json({ target });
    } catch (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
    }
};

// Update daily target by ID
const updatetargets = async (req, res) => {
    const id = req.params.id;
    const { targetDate, productName, targetQuantity, achievedQuantity, status, employee, remarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const updatedTarget = await DailyTarget.findByIdAndUpdate(
            id,
            { targetDate, productName, targetQuantity, achievedQuantity, status, employee, remarks },
            { new: true }
        );

        if (!updatedTarget) {
            return res.status(404).json({ message: "Daily target not found" });
        }

        return res.status(200).json({ updatedTarget });
    } catch (err) {
        return res.status(500).json({ message: "Unable to update daily target", error: err.message });
    }
};

// Delete target
const deletetarget = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const target = await DailyTarget.findByIdAndDelete(id);

        if (!target) {
            return res.status(404).json({ message: "Unable to remove target" });
        }

        return res.status(200).json({ target });
    } catch (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
    }
};

module.exports = { getAllDailyTargets, addDailyTarget, getbyid, updatetargets, deletetarget };
0   