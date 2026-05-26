const Certificate = require("../models/Certificate");
const { createCertificateHash } = require("../services/hashService");
const {
  issueCertificateOnChain,
  revokeCertificateOnChain,
  verifyCertificateOnChain
} = require("../services/blockchainService");
const qrcode = require("qrcode");
const { successResponse } = require("../utils/apiResponse");

const issueCertificate = async (req, res, next) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      courseName,
      degreeName,
      universityName,
      certificateId: providedCertificateId,
      fileUrl
    } = req.body;
    const certificateId = providedCertificateId || studentId;
    const programName = courseName || degreeName;

    const certificateHash = createCertificateHash({ 
      studentId: certificateId,
      studentName, 
      universityName, 
      courseName: programName
    });

    if (await Certificate.exists({ certificateHash })) {
      return res.status(409).json({ success: false, message: "Certificate with this hash already exists" });
    }

    let blockchainResult;
    try {
      blockchainResult = await issueCertificateOnChain({
        certificateHash,
        studentId: certificateId,
        universityName,
        courseName: programName
      });
    } catch (blockchainError) {
      return res.status(500).json({ 
        success: false, 
        message: "Blockchain issuance failed: " + blockchainError.message 
      });
    }

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify?hash=${certificateHash}`;
    const qrCodeUrl = await qrcode.toDataURL(verificationUrl);

    // Save to MongoDB
    const certificate = await Certificate.create({
      studentName,
      studentEmail,
      degreeName: degreeName || programName,
      universityName,
      certificateId,
      certificateHash,
      fileUrl,
      qrCodeUrl,
      status: "ACTIVE",
      issuedBy: req.user._id,
      blockchainTxHash: blockchainResult.transactionHash
    });

    return res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      data: {
        certificate: {
          ...certificate.toObject(),
          transactionHash: blockchainResult.transactionHash
        },
        transaction: blockchainResult,
        verificationUrl,
        qrCode: qrCodeUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

const listCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .populate("issuedBy", "name email");
    return res.status(200).json({ success: true, data: certificates });
  } catch (error) {
    next(error);
  }
};

const getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateHash: req.params.hash });
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }
    return res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
};

const revokeCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateHash: req.params.hash });
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    // Call blockchain revoke
    await revokeCertificateOnChain(certificate.certificateHash);

    certificate.status = "REVOKED";
    certificate.revokedAt = new Date();
    await certificate.save();

    return res.status(200).json({ success: true, message: "Certificate revoked", data: certificate });
  } catch (error) {
    next(error);
  }
};

module.exports = { issueCertificate, listCertificates, getCertificate, revokeCertificate };
