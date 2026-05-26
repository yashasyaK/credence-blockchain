const generateQRCode = require("../utils/generateQRCode");

const createVerificationBadge = (certificateHash) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const url = `${baseUrl}/?hash=${encodeURIComponent(certificateHash)}`;
  return { url, qrCode: generateQRCode(url) };
};

module.exports = { createVerificationBadge };
