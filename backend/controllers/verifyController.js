const VerificationLog = require("../models/VerificationLog");
const Certificate = require("../models/Certificate");
const { verifyCertificateOnChain } = require("../services/blockchainService");
const { calculateTamperRisk } = require("../services/aiDetectionService");
const mongoose = require("mongoose");

const verifyByHash = async (req, res, next) => {
  try {
    const { certificateHash, verifierName, verifierEmail } = req.body;

    if (!certificateHash) {
      return res.status(400).json({ success: false, message: "Certificate hash is required" });
    }

    // Verify on blockchain
    const blockchainResult = await verifyCertificateOnChain(certificateHash);

    // Logic:
    // VALID if blockchain says valid and not revoked.
    // REVOKED if revoked.
    // FAKE if not valid (not exist or not valid).
    let verificationStatus = "FAKE";
    if (blockchainResult.exists) {
      if (blockchainResult.isValid) {
        verificationStatus = "VALID";
      } else {
        verificationStatus = "REVOKED";
      }
    }

    const databaseAvailable = mongoose.connection.readyState === 1;
    const certificateData = databaseAvailable
      ? await Certificate.findOne({ certificateHash })
      : null;

    // AI/Tamper Risk
    const aiRisk = calculateTamperRisk({
      blockchainResult,
      certificateData
    });

    const log = databaseAvailable
      ? await VerificationLog.create({
          certificateId: certificateData?._id,
          certificateHash,
          verifierName,
          verifierEmail,
          verificationStatus,
          blockchainResult,
          aiRisk,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"]
        })
      : null;

    return res.status(200).json({
      success: true,
      message: "Verification completed",
      data: {
        verificationStatus,
        blockchainResult,
        aiRisk,
        certificate: certificateData,
        logId: log?._id || null
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifyById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.certificateId);
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    // Reuse hash verification logic
    req.body.certificateHash = certificate.certificateHash;
    return verifyByHash(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyByHash,
  verifyById
};
