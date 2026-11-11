const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: "", trim: true, maxlength: 500 },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Photo", photoSchema);