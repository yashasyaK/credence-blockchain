const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, trim: true },
    degreeName: { type: String, required: true, trim: true },
    universityName: { type: String, required: true, trim: true },
    certificateId: { type: String, required: true, unique: true, trim: true },
    certificateHash: { type: String, required: true, unique: true, trim: true },
    fileUrl: { type: String, trim: true },
    qrCodeUrl: { type: String, trim: true },
    status: { type: String, enum: ["ACTIVE", "REVOKED"], default: "ACTIVE" },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    blockchainTxHash: { type: String },
    revokedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
