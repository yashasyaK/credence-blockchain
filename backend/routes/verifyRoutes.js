const express = require("express");
const { verifyByHash, verifyById } = require("../controllers/verifyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/hash", verifyByHash);
router.post("/", verifyByHash);
router.get("/:certificateId", protect, verifyById);

module.exports = router;
