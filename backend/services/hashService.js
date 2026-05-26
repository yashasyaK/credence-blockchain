const generateHash = require("../utils/generateHash");

const createCertificateHash = ({
  studentId,
  studentName,
  universityName,
  courseName,
  issueDate
}) =>
  generateHash({
    studentId: studentId.trim(),
    studentName: studentName.trim(),
    universityName: universityName.trim(),
    courseName: courseName.trim(),
    issueDate: issueDate || new Date().toISOString().slice(0, 10)
  });

module.exports = { createCertificateHash };
