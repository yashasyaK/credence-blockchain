const Certificate = require("../models/Certificate");
const VerificationLog = require("../models/VerificationLog");
const User = require("../models/User");
const { addIssuerOnChain, checkIssuer } = require("../services/blockchainService");
const { successResponse } = require("../utils/apiResponse");

const getDashboard = async (req, res, next) => {
  try {
    const [issued, revoked, verifications, validVerifications, recentVerifications] =
      await Promise.all([
        Certificate.countDocuments(),
        Certificate.countDocuments({ status: "REVOKED" }),
        VerificationLog.countDocuments(),
        VerificationLog.countDocuments({ verificationStatus: "VALID" }),
        VerificationLog.find().sort({ createdAt: -1 }).limit(8)
      ]);

    return successResponse(res, 200, "Dashboard loaded", {
      metrics: {
        issued,
        active: issued - revoked,
        revoked,
        verifications,
        validVerifications
      },
      recentVerifications
    });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    return successResponse(res, 200, "Users loaded", users);
  } catch (error) {
    next(error);
  }
};

const addBlockchainIssuer = async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    const transaction = await addIssuerOnChain(walletAddress);
    return successResponse(res, 200, "Wallet authorized as blockchain issuer", transaction);
  } catch (error) {
    next(error);
  }
};

const issuerStatus = async (req, res, next) => {
  try {
    const authorized = await checkIssuer(req.params.address);
    return successResponse(res, 200, "Issuer status loaded", { authorized });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const allowedRoles = ["admin", "university", "recruiter", "student"];
    if (!allowedRoles.includes(req.body.role)) {
      return res.status(400).json({ success: false, message: "Invalid user role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return successResponse(res, 200, "User role updated", user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, listUsers, addBlockchainIssuer, issuerStatus, updateUserRole };
