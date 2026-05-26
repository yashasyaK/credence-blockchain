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

  const certificateHash = "abc123certificatehash";

  const tx = await contract.revokeCertificate(certificateHash);

  await tx.wait();

  console.log("Certificate revoked successfully");
  console.log("Transaction hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});