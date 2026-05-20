import exp from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import { authApp } from "./APIs/AuthAPI.js";
import { medicineApp } from "./APIs/MedicineAPI.js";
import { requestApp } from "./APIs/RequestAPI.js";
import { chatApp } from "./APIs/ChatAPI.js";

config();

const app = exp();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = frontendUrl.split(",").map((origin) => origin.trim());
const isLocalDevOrigin = (origin) => /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin))) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(exp.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Rare Medicine Locator API is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "rare-medicine-backend" });
});

app.use("/auth", authApp);
app.use("/medicine-api", medicineApp);
app.use("/request-api", requestApp);
app.use("/chat-api", chatApp);

app.use((req, res) => {
  res.status(404).json({ message: `Path ${req.originalUrl} is invalid` });
});

app.use((err, req, res, next) => {
  console.log("Error:", err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed", error: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id", error: err.message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: "Server error",
    error: err.message || "Something went wrong"
  });
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5001;
    app.listen(port, () => console.log(`Server listening on ${port}`));
  } catch (err) {
    console.log("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
