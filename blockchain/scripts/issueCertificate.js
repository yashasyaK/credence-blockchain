require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  console.log("Contract address from .env:", contractAddress);

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS is missing in .env file");
  }

  const CertificateVerification = await hre.ethers.getContractFactory(
    "CertificateVerification"
  );

  const contract = CertificateVerification.attach(contractAddress);

  const tx = await contract.issueCertificate(
    "newCertificateHash001",
    "STUDENT001",
    "Demo University",
    "B.Tech Computer Science"
  );

  await tx.wait();

  console.log("Certificate issued successfully");
  console.log("Transaction hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});