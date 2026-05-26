const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health Route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/verify", require("./routes/verifyRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.post("/test-verify", require("./controllers/verifyController").verifyByHash);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    return app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
