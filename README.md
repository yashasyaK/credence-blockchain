# Credence

Credence is a blockchain-backed credential verification platform with an
animated React/Three.js frontend, issuer workflow, audit logging, and risk
scoring.

## Run Locally

The API uses port `5001` because port `5000` on this Mac is already occupied
by macOS ControlCenter and returns `403` responses.

```bash
# Terminal 1: local blockchain, if it is not already running
cd blockchain
npx hardhat node

# Terminal 2: API
cd backend
npm start

# Terminal 3: animated web app
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Important API Routes

```text
POST /test-verify             Compatibility endpoint for the Postman request
POST /api/verify/hash         Public credential verification
POST /api/auth/register       Register an account
POST /api/auth/login          Sign in
POST /api/certificates/issue  Mint a credential (admin/university role)
PATCH /api/certificates/:hash/revoke
GET /api/admin/dashboard      Metrics and recent verifications
```

For the Postman request shown in the screenshot, use:

```text
POST http://localhost:5001/test-verify
Content-Type: application/json
```

```json
{
  "certificateHash": "0x1111111111111111111111111111111111111111111111111111111111111111",
  "verifierName": "Test Recruiter",
  "verifierEmail": "test@example.com"
}
```

An unissued hash responds successfully with status `FAKE`; it is not an API
error. The first registered account in a fresh database becomes the platform
admin. Further issuer roles should be approved through the admin API.
