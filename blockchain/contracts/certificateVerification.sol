// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {
    address public owner;

    struct Certificate {
        string certificateHash;
        string studentId;
        string universityName;
        string courseName;
        uint256 issuedAt;
        bool isRevoked;
        address issuedBy;
    }

    mapping(string => Certificate) private certificates;
    mapping(address => bool) public authorizedIssuers;

    event CertificateIssued(
        string certificateHash,
        string studentId,
        string universityName,
        uint256 issuedAt,
        address issuedBy
    );

    event CertificateRevoked(
        string certificateHash,
        uint256 revokedAt,
        address revokedBy
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }

    function addIssuer(address issuer) public onlyOwner {
        authorizedIssuers[issuer] = true;
    }

    function removeIssuer(address issuer) public onlyOwner {
        authorizedIssuers[issuer] = false;
    }

    function issueCertificate(
        string memory _certificateHash,
        string memory _studentId,
        string memory _universityName,
        string memory _courseName
    ) public onlyIssuer {
        require(
            bytes(certificates[_certificateHash].certificateHash).length == 0,
            "Certificate already exists"
        );

        certificates[_certificateHash] = Certificate({
            certificateHash: _certificateHash,
            studentId: _studentId,
            universityName: _universityName,
            courseName: _courseName,
            issuedAt: block.timestamp,
            isRevoked: false,
            issuedBy: msg.sender
        });

        emit CertificateIssued(
            _certificateHash,
            _studentId,
            _universityName,
            block.timestamp,
            msg.sender
        );
    }

    function verifyCertificate(
        string memory _certificateHash
    ) public view returns (
        bool exists,
        bool isValid,
        string memory studentId,
        string memory universityName,
        string memory courseName,
        uint256 issuedAt,
        address issuedBy
    ) {
        Certificate memory cert = certificates[_certificateHash];

        if (bytes(cert.certificateHash).length == 0) {
            return (false, false, "", "", "", 0, address(0));
        }

        return (
            true,
            !cert.isRevoked,
            cert.studentId,
            cert.universityName,
            cert.courseName,
            cert.issuedAt,
            cert.issuedBy
        );
    }

    function revokeCertificate(
        string memory _certificateHash
    ) public onlyIssuer {
        require(
            bytes(certificates[_certificateHash].certificateHash).length != 0,
            "Certificate does not exist"
        );

        certificates[_certificateHash].isRevoked = true;

        emit CertificateRevoked(
            _certificateHash,
            block.timestamp,
            msg.sender
        );
    }

    function getCertificate(
        string memory _certificateHash
    ) public view returns (Certificate memory) {
        require(
            bytes(certificates[_certificateHash].certificateHash).length != 0,
            "Certificate does not exist"
        );

        return certificates[_certificateHash];
    }
}