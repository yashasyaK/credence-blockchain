const express = require("express");
const {
  issueCertificate,
  listCertificates,
  getCertificate,
  revokeCertificate
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateRequired } = require("../middleware/validationMiddleware");
const { acceptDocumentUrl } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", authorizeRoles("admin", "university"), listCertificates);
router.get("/:hash", getCertificate);
router.post(
  "/issue",
  authorizeRoles("admin", "university"),
  validateRequired(["studentId", "studentName", "studentEmail", "degreeName", "universityName", "courseName"]),
  issueCertificate
);
router.post(
  "/",
  authorizeRoles("admin", "university"),
  acceptDocumentUrl,
  validateRequired(["studentId", "studentName", "studentEmail", "degreeName", "universityName", "courseName"]),
  issueCertificate
);
router.patch("/:hash/revoke", authorizeRoles("admin", "university"), revokeCertificate);

module.exports = router;
