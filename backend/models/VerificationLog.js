const mongoose = require("mongoose");

const verificationLogSchema = new mongoose.Schema(
  {
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate"
    },

    certificateHash: {
      type: String,
      required: true
    },

    verifierName: {
      type: String,
      default: "Anonymous"
    },

    verifierEmail: {
      type: String
    },

    verificationStatus: {
      type: String,
      enum: ["VALID", "FAKE", "REVOKED", "ERROR"],
      required: true
    },

    blockchainResult: {
      exists: Boolean,
      isValid: Boolean,
      isRevoked: Boolean,
      issuer: String,
      issuedAt: Number,
      studentId: String,
      universityName: String,
      courseName: String
    },

    aiRisk: {
      riskScore: Number,
      status: String,
      reasons: [String]
    },

    ipAddress: {
      type: String
    },

    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("VerificationLog", verificationLogSchema);
