const crypto = require("crypto");

const secret = () => process.env.JWT_SECRET || "credence-local-development-secret";

const encode = (value) => Buffer.from(value).toString("base64url");

const generateToken = (user, expiresInSeconds = 60 * 60 * 24 * 7) => {
  const now = Math.floor(Date.now() / 1000);
  const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = encode(
    JSON.stringify({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + expiresInSeconds
    })
  );
  const signature = crypto
    .createHmac("sha256", secret())
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
};

const verifyToken = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid authentication token");
  const expected = crypto
    .createHmac("sha256", secret())
    .update(`${parts[0]}.${parts[1]}`)
    .digest("base64url");
  if (
    expected.length !== parts[2].length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]))
  ) {
    throw new Error("Invalid authentication token");
  }
  const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  if (payload.exp <= Math.floor(Date.now() / 1000)) throw new Error("Session expired");
  return payload;
};

module.exports = { generateToken, verifyToken };
