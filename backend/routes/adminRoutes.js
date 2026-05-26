const express = require("express");
const {
  getDashboard,
  listUsers,
  addBlockchainIssuer,
  issuerStatus,
  updateUserRole
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRequired } = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("admin", "university"), getDashboard);
router.get("/users", protect, authorizeRoles("admin"), listUsers);
router.patch("/users/:id/role", protect, authorizeRoles("admin"), validateRequired(["role"]), updateUserRole);
router.get("/issuers/:address", protect, authorizeRoles("admin"), issuerStatus);
router.post("/issuers", protect, authorizeRoles("admin"), validateRequired(["walletAddress"]), addBlockchainIssuer);

module.exports = router;
