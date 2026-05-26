const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateVerification to Sepolia...");

  const CertificateVerification = await hre.ethers.getContractFactory("CertificateVerification");
  const certificateVerification = await CertificateVerification.deploy();

  await certificateVerification.waitForDeployment();

  const address = await certificateVerification.getAddress();
  console.log("CertificateVerification deployed to:", address);
  
  console.log("\nNext Steps:");
  console.log("1. Update CONTRACT_ADDRESS in your backend .env file to:", address);
  console.log("2. Verify the contract on Etherscan (optional):");
  console.log(`   npx hardhat verify --network sepolia ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
