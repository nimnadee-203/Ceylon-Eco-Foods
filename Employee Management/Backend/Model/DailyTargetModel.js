const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailyTargetSchema = new Schema({
    targetDate: { type: String, required: true },
    productName: { type: String, required: true },
    targetQuantity: { type: Number, required: true },
    achievedQuantity: { type: Number, required: true },
    status: { type: String, required: true },
    employee: [{ type: String, required: true }], // <-- array
    remarks: { type: String, required: false }
});

module.exports = mongoose.model("DailyTargetModel", DailyTargetSchema);
