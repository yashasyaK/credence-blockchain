const { ethers } = require("ethers");
require("dotenv").config();

const contractABI = [
  "function issueCertificate(string certificateHash, string studentId, string universityName, string courseName) public",
  "function verifyCertificate(string certificateHash) public view returns (bool exists, bool isValid, string studentId, string universityName, string courseName, uint256 issuedAt, address issuedBy)",
  "function revokeCertificate(string certificateHash) public",
  "function addIssuer(address issuer) public",
  "function authorizedIssuers(address issuer) public view returns (bool)"
];

const getContract = () => {
  if (
    !process.env.BLOCKCHAIN_RPC_URL ||
    !process.env.PRIVATE_KEY ||
    !process.env.CONTRACT_ADDRESS
  ) {
    const error = new Error("Blockchain connection is not configured");
    error.statusCode = 503;
    throw error;
  }

  const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  return new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);
};

module.exports = {
  contractABI,
  getContract
};
