const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

function listFromEnv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const allowedOrigins = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  ...listFromEnv(process.env.CLIENT_URL),
  ...listFromEnv(process.env.CLIENT_URLS)
];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === "true";
  return allowVercelPreviews && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Student Performance Analytics API is running",
    database: "MongoDB"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/performance", performanceRoutes);

connectDB()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Student Performance Analytics API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
