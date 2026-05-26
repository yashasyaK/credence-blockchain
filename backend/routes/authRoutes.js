const express = require("express");
const { register, login, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validateRequired, validateEmail } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/register", validateRequired(["name", "email", "password"]), validateEmail, register);
router.post("/login", validateRequired(["email", "password"]), validateEmail, login);
router.get("/profile", protect, getProfile);
router.get("/me", protect, getProfile);

module.exports = router;
