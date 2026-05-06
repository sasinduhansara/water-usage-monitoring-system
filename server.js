import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== CHECK ENV =====
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI missing in .env");
  process.exit(1);
}

// ===== MongoDB =====
const client = new MongoClient(process.env.MONGODB_URI);

let db;
let dbReady = false;

// ===== LIVE DATA =====
let liveWaterData = {
  total: 0,
  daily: 0,
  monthly: 0,
  updatedAt: new Date(),
};

// ===== CONNECT DB =====
async function connectDB() {
  try {
    await client.connect();
    db = client.db("water_usage_db");
    dbReady = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
}

// ================= AUTH =================

// REGISTER
app.post("/api/register", async (req, res) => {
  if (!dbReady) return res.status(503).json({ error: "DB not ready" });

  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  try {
    const exists = await db.collection("users").findOne({ email });

    if (exists) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name,
      email,
      password: hashed,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  if (!dbReady) return res.status(503).json({ error: "DB not ready" });

  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = `token_${user._id}_${Date.now()}`;

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= WATER =================

// ESP SEND DATA
app.post("/api/water", async (req, res) => {
  try {
    const { total, daily, monthly } = req.body;

    liveWaterData = {
      total: Number(total) || 0,
      daily: Number(daily) || 0,
      monthly: Number(monthly) || 0,
      updatedAt: new Date(),
    };

    if (dbReady) {
      await db.collection("water_history").insertOne(liveWaterData);
    }

    console.log("📡 ESP:", liveWaterData);

    res.json({ success: true, liveWaterData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Water update failed" });
  }
});

// REACT GET LIVE DATA
app.get("/api/water", (req, res) => {
  res.json(liveWaterData);
});

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: dbReady ? "connected" : "not connected",
  });
});

// START SERVER
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});
