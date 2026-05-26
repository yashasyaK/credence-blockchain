const { isCloudinaryConfigured } = require("../config/cloudinary");

const uploadCertificateDocument = async (documentUrl) => {
  if (!documentUrl) return null;
  if (!isCloudinaryConfigured()) {
    return { secure_url: documentUrl, provider: "external-url" };
  }
  const error = new Error("Cloudinary upload adapter requires the Cloudinary SDK");
  error.statusCode = 501;
  throw error;
};

module.exports = { uploadCertificateDocument };
