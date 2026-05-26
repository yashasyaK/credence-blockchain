const calculateTamperRisk = ({ blockchainResult, certificateData }) => {
  let riskScore = 0;
  const reasons = [];

  if (!blockchainResult.isValid) {
    riskScore += 60;
    reasons.push("Certificate hash was not found on blockchain");
  }

  if (blockchainResult.isRevoked) {
    riskScore += 80;
    reasons.push("Certificate has been revoked on blockchain");
  }

  if (!certificateData?.certificateHash) {
    riskScore += 30;
    reasons.push("Certificate hash is missing");
  }

  if (certificateData?.studentName && certificateData.studentName.length < 3) {
    riskScore += 10;
    reasons.push("Student name looks suspicious");
  }

  if (certificateData?.degreeName && certificateData.degreeName.length < 2) {
    riskScore += 10;
    reasons.push("Degree name looks suspicious");
  }

  if (certificateData?.issueDate) {
    const issueDate = new Date(certificateData.issueDate);
    const now = new Date();

    if (issueDate > now) {
      riskScore += 30;
      reasons.push("Issue date is in the future");
    }
  }

  if (riskScore > 100) {
    riskScore = 100;
  }

  let status = "LOW_RISK";

  if (riskScore >= 70) {
    status = "HIGH_RISK";
  } else if (riskScore >= 35) {
    status = "MEDIUM_RISK";
  }

  return {
    riskScore,
    status,
    reasons
  };
};

module.exports = {
  calculateTamperRisk
};