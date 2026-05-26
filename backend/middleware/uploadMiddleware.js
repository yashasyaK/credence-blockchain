const acceptDocumentUrl = (req, res, next) => {
  if ((req.headers["content-type"] || "").includes("multipart/form-data")) {
    return res.status(415).json({
      success: false,
      message: "Use a hosted documentUrl in JSON for this deployment"
    });
  }
  next();
};

module.exports = { acceptDocumentUrl };
