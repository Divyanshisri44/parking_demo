const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Routes
========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/parking", require("./routes/parking"));
app.use("/api/payment", require("./routes/payment"));

/* =========================
   MongoDB Connection
========================= */
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  });

/* =========================
   Health Check
========================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running fine 🚀",
  });
});

/* =========================
   Server Start
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
