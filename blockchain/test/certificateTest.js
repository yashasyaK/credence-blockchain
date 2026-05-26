const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateVerification", function () {
  let contract;
  let owner;
  let issuer;
  let stranger;

  beforeEach(async function () {
    [owner, issuer, stranger] = await ethers.getSigners();

    const CertificateVerification = await ethers.getContractFactory(
      "CertificateVerification"
    );

    contract = await CertificateVerification.deploy();
    await contract.waitForDeployment();
  });

  it("should allow owner to add issuer", async function () {
    await contract.addIssuer(issuer.address);
    expect(await contract.authorizedIssuers(issuer.address)).to.equal(true);
  });

  it("should issue certificate by authorized issuer", async function () {
    await contract.addIssuer(issuer.address);

    await contract.connect(issuer).issueCertificate(
      "hash123",
      "STUDENT001",
      "Demo University",
      "B.Tech CSE"
    );

    const result = await contract.verifyCertificate("hash123");

    expect(result[0]).to.equal(true);
    expect(result[1]).to.equal(true);
    expect(result[2]).to.equal("STUDENT001");
  });

  it("should reject duplicate certificate hash", async function () {
    await contract.issueCertificate(
      "hash123",
      "STUDENT001",
      "Demo University",
      "B.Tech CSE"
    );

    await expect(
      contract.issueCertificate(
        "hash123",
        "STUDENT002",
        "Demo University",
        "B.Tech IT"
      )
    ).to.be.revertedWith("Certificate already exists");
  });

  it("should revoke certificate", async function () {
    await contract.issueCertificate(
      "hash123",
      "STUDENT001",
      "Demo University",
      "B.Tech CSE"
    );

    await contract.revokeCertificate("hash123");

    const result = await contract.verifyCertificate("hash123");

    expect(result[0]).to.equal(true);
    expect(result[1]).to.equal(false);
  });

  it("should block non-issuer from issuing certificate", async function () {
    await expect(
      contract.connect(stranger).issueCertificate(
        "hash123",
        "STUDENT001",
        "Fake University",
        "Fake Course"
      )
    ).to.be.revertedWith("Not an authorized issuer");
  });
});