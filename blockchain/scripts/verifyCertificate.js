require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS is missing in .env file");
  }

  const CertificateVerification = await hre.ethers.getContractFactory(
    "CertificateVerification"
  );

  const contract = CertificateVerification.attach(contractAddress);

  const certificateHash = "newCertificateHash001";

  const result = await contract.verifyCertificate(certificateHash);

  console.log("Verification Result:");
  console.log("Exists:", result[0]);
  console.log("Is Valid:", result[1]);
  console.log("Student ID:", result[2]);
  console.log("University:", result[3]);
  console.log("Course:", result[4]);
  console.log("Issued At:", new Date(Number(result[5]) * 1000).toLocaleString());
  console.log("Issued By:", result[6]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});