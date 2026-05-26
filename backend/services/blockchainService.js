const { ethers } = require("ethers");
const { getContract } = require("../config/blockchain");

const normalizeHash = (hash) => {
  if (!hash || typeof hash !== "string") {
    throw new Error("Certificate hash is required");
  }

  const normalized = hash.trim();

  // The Solidity contract stores string keys, so legacy labels and SHA-256 keys are both valid.
  if (normalized.length < 3 || normalized.length > 256) {
    const error = new Error("Certificate hash must be between 3 and 256 characters");
    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

const verifyCertificateOnChain = async (certificateHash) => {
  const hash = normalizeHash(certificateHash);
  const contract = getContract();

  const result = await contract.verifyCertificate(hash);

  return {
    exists: result[0],
    isValid: result[1],
    isRevoked: result[0] && !result[1],
    studentId: result[2],
    universityName: result[3],
    courseName: result[4],
    issuedAt: Number(result[5]),
    issuer: result[6]
  };
};

const issueCertificateOnChain = async ({
  certificateHash,
  studentId,
  universityName,
  courseName
}) => {
  const hash = normalizeHash(certificateHash);
  const contract = getContract();

  const tx = await contract.issueCertificate(
    hash,
    studentId,
    universityName,
    courseName
  );
  const receipt = await tx.wait();

  return {
    transactionHash: receipt.hash || tx.hash,
    blockNumber: receipt.blockNumber
  };
};

const revokeCertificateOnChain = async (certificateHash) => {
  const hash = normalizeHash(certificateHash);
  const contract = getContract();

  const tx = await contract.revokeCertificate(hash);
  const receipt = await tx.wait();

  return {
    transactionHash: receipt.hash,
    blockNumber: receipt.blockNumber
  };
};

const checkIssuer = async (address) => {
  if (!ethers.isAddress(address)) {
    const error = new Error("Invalid Ethereum address");
    error.statusCode = 400;
    throw error;
  }

  return getContract().authorizedIssuers(address);
};

const addIssuerOnChain = async (address) => {
  if (!ethers.isAddress(address)) {
    const error = new Error("Invalid Ethereum address");
    error.statusCode = 400;
    throw error;
  }

  const tx = await getContract().addIssuer(address);
  const receipt = await tx.wait();
  return { transactionHash: receipt.hash || tx.hash, blockNumber: receipt.blockNumber };
};

module.exports = {
  verifyCertificateOnChain,
  issueCertificateOnChain,
  revokeCertificateOnChain,
  checkIssuer,
  addIssuerOnChain,
  normalizeHash
};
