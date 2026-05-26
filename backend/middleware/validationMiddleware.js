const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || String(value).trim() === "";
  });
  if (missing.length) {
    return res.status(400).json({
      success: false,
      message: `Required fields missing: ${missing.join(", ")}`
    });
  }
  next();
};

const validateEmail = (req, res, next) => {
  if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    return res.status(400).json({ success: false, message: "Enter a valid email address" });
  }
  next();
};

module.exports = { validateRequired, validateEmail };
