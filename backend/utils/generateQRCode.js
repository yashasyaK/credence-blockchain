const generateQRCode = (verificationUrl) => {
  const safeUrl = String(verificationUrl).replace(/[<>&'"]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80"><rect width="100%" height="100%" rx="12" fill="#081629"/><text x="16" y="32" fill="#30e0bd" font-family="monospace" font-size="13">VERIFY ON CREDENCE</text><text x="16" y="56" fill="#fff" font-family="monospace" font-size="10">${safeUrl}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

module.exports = generateQRCode;
