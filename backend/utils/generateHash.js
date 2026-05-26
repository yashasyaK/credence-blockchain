const crypto = require("crypto");

const generateHash = (payload) => {
  const normalized =
    typeof payload === "string"
      ? payload
      : JSON.stringify(payload, Object.keys(payload).sort());
  return `0x${crypto.createHash("sha256").update(normalized).digest("hex")}`;
};

module.exports = generateHash;
